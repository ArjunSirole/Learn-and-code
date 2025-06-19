import { NewsApi } from '../api/newsApi';
import { Article } from '../interfaces/Article';
import inquirer from 'inquirer';
import { format } from 'date-fns';

export class NewsService {
  private api = new NewsApi();

  async showHeadlines(date?: string, startDate?: string, endDate?: string, userName = 'User') {
    const response = await this.api.getHeadlines(date, startDate, endDate);
    const articles: Article[] = response.data?.articles ?? [];

    if (!articles.length) {
      console.log('No articles found.');
      return;
    }

    const categories = ['All', 'Business', 'Entertainment', 'Sports', 'Technology'];
    const currentDate = format(new Date(), 'dd-MMM-yyyy');
    const currentTime = format(new Date(), 'h:mmaaa');

    console.log(`\nWelcome to the News Application, ${userName}! Date: ${currentDate}`);
    console.log(`Time: ${currentTime}`);
    console.log('Please choose the options below for Headlines:');

    const { selectedCategory } = await inquirer.prompt([
      {
        type: 'list',
        name: 'selectedCategory',
        message: 'Select a news category:',
        choices: categories,
      },
    ]);

    const filtered = articles.filter((article) => {
      const cat = selectedCategory.toLowerCase();
      return selectedCategory === 'All'
        || article.category?.toLowerCase() === cat
        || article.categories?.map((c) => c.toLowerCase()).includes(cat);
    });

    if (!filtered.length) {
      console.log(`No "${selectedCategory}" news found for selected date.`);
      return;
    }

    console.log(`\n📰 ${selectedCategory} Headlines:\n`);
    filtered.forEach((article) => {
      console.log(article.title);
      console.log(article.url);
      console.log(article.category || article.categories?.join(', ') || 'Uncategorized');
      console.log('-------------------------');
    });

    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Would you like to take any action?',
        choices: [
          { name: 'Save an article', value: 'save' },
          { name: 'Report an article', value: 'report' },
          { name: 'No action', value: 'none' }
        ]
      }
    ]);

    if (action === 'save' || action === 'report') {
      const { selectedArticle } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedArticle',
          message: `Select an article to ${action}:`,
          choices: filtered.map((a) => ({ name: a.title, value: a }))
        }
      ]);

      if (action === 'save') {
        await this.api.saveArticle({
          articleId: selectedArticle.id,
          title: selectedArticle.title,
          url: selectedArticle.url,
          source: selectedArticle.source || 'Unknown',
        });
        console.log(`✅ Saved article: "${selectedArticle.title}"`);
      }

      if (action === 'report') {
        const { reason } = await inquirer.prompt([
          {
            type: 'input',
            name: 'reason',
            message: 'Enter a reason for reporting this article:',
            validate: (input) => input.trim() !== '' || 'Reason cannot be empty',
          }
        ]);

        await this.api.reportArticle(selectedArticle.id, reason);
        console.log(`⚠️ Reported article: "${selectedArticle.title}"`);
      }
    }
  }

  async showSavedArticles(filter?: 'LIKE' | 'DISLIKE') {
    const response = await this.api.getSavedArticles();
    const articles = response.data ?? [];

    const filtered = filter ? articles.filter((a: any) => a.feedback === filter) : articles;

    if (!filtered.length) {
      console.log(`No ${filter?.toLowerCase() || ''} articles found.`);
      return;
    }

    console.log(`\n${filter ? `${filter}D` : 'Saved'} Articles:\n`);
    filtered.forEach((article: any) => {
      console.log(`${article.id}`);
      console.log(`${article.title}`);
      console.log(`${article.url}`);
      console.log(`${article.source}`);
      if (article.feedback) console.log(`Feedback: ${article.feedback}`);
      console.log('-------------------------');
    });
  }

  async giveFeedbackToArticle(articleId: string, feedback: 'LIKE' | 'DISLIKE') {
    await this.api.giveFeedback(articleId, feedback);
    console.log(`${feedback === 'LIKE' ? 'Liked' : 'Disliked'} article ${articleId}`);
  }

  async getSavedArticles() {
    const response = await this.api.getSavedArticles();
    return response.data ?? [];
  }

  async deleteSavedArticle(articleId: string) {
    await this.api.deleteArticle(articleId);
    console.log(`Deleted article with ID ${articleId}`);
  }

  async searchArticles(query: string, category?: string, startDate?: string, endDate?: string, sortBy?: string) {
    const response = await this.api.searchArticles(query, category, startDate, endDate, sortBy);
    const articles = response.data ?? [];

    const deduped = Array.from(new Map(articles.map((a: any) => [a.title, a])).values());

    if (!deduped.length) {
      console.log('No articles found.');
      return;
    }

    console.log(`\nSearch Results for "${query}":\n`);
    let index = 0;
    const pageSize = 10;

    while (index < deduped.length) {
      const page = deduped.slice(index, index + pageSize);

      page.forEach((article: any, i: number) => {
        console.log(`${index + i + 1}. ${article.title}`);
        console.log(`${article.url}`);
        console.log(`${article.source}   ${article.published_at}`);
        if (article.feedback_count) {
          console.log(`Likes: ${article.feedback_count.like || 0}  Dislikes: ${article.feedback_count.dislike || 0}`);
        }
        console.log('--------------------------');
      });

      const { wantToSave } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'wantToSave',
          message: 'Would you like to save an article from this page?',
          default: false,
        },
      ]);

      if (wantToSave) {
        const { selectedArticle } = await inquirer.prompt([
          {
            type: 'list',
            name: 'selectedArticle',
            message: 'Select an article to save:',
            choices: page.map((a: any) => ({ name: a.title, value: a })),
          },
        ]);

        await this.api.saveArticle({
          articleId: selectedArticle.id,
          title: selectedArticle.title,
          url: selectedArticle.url,
          source: selectedArticle.source || 'Unknown',
        });

        console.log(`Saved article: "${selectedArticle.title}"`);
      }

      index += pageSize;

      if (index < deduped.length) {
        const { showMore } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'showMore',
            message: 'Show more results?',
            default: false,
          },
        ]);
        if (!showMore) break;
      } else {
        console.log('\nEnd of search results.');
      }
    }
  }

  async reportArticle(articleId: number, reason: string) {
    await this.api.reportArticle(articleId, reason);
    console.log(`Reported article with ID ${articleId} successfully.`);
  }
}

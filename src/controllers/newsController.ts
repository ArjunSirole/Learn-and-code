import { Request, Response, RequestHandler } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { NewsService } from "../services/newsService";

const newsService = new NewsService();

export async function fetchHeadlines(req: Request, res: Response): Promise<void> {
  try {
    const date = req.query.date as string | undefined;
    const articles = await newsService.getArticlesFromDB(date);

    if (!articles || articles.length === 0) {
      res.sendStatus(204);
      return;
    }

    res.status(200).json({ articles });
  } catch (error) {
    handleError("fetching headlines", error, res);
  }
}

export async function saveUserArticle(req: AuthRequest, res: Response): Promise<void> {
  const { articleId, title, url, source } = req.body;
  const userId = req.user.id;

  try {
    await newsService.saveArticle(articleId, title, url, source);
    await newsService.associateArticleWithUser(userId, articleId);
    res.status(200).json({ message: "Article saved successfully" });
  } catch (error) {
    handleError("saving article", error, res);
  }
}

export async function fetchSavedArticles(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user.id;

  try {
    const articles = await newsService.getSavedArticles(userId);
    res.status(200).json(articles);
  } catch (error) {
    handleError("fetching saved articles", error, res);
  }
}

export async function removeSavedArticle(req: AuthRequest, res: Response): Promise<void> {
  const { articleId } = req.params;
  const userId = req.user.id;

  try {
    await newsService.deleteSavedArticle(userId, articleId);
    res.status(200).json({ message: "Article removed from saved list" });
  } catch (error) {
    handleError("deleting saved article", error, res);
  }
}

export const searchArticles: RequestHandler = async (req, res) => {
  const { query, category, startDate, endDate, sortBy } = req.query;

  if (!query) {
    res.status(400).json({ message: "Search query is required." });
    return;
  }

  try {
    const results = await newsService.searchArticles(
      query as string,
      category as string | undefined,
      startDate as string | undefined,
      endDate as string | undefined,
      sortBy as string | undefined
    );
    res.status(200).json(results);
  } catch (error) {
    handleError("searching articles", error, res);
  }
};

export async function giveFeedbackOnArticle(req: AuthRequest, res: Response): Promise<void> {
  const articleId = parseInt(req.params.article_id);
  const { feedback } = req.body;
  const userId = req.user.id;

  if (!["LIKE", "DISLIKE"].includes(feedback)) {
    res.status(400).json({ message: "Feedback must be 'LIKE' or 'DISLIKE'." });
    return;
  }

  if (isNaN(articleId)) {
    res.status(400).json({ message: "Invalid article ID." });
    return;
  }

  try {
    await newsService.submitFeedback(userId, articleId, feedback);
    res.status(200).json({ message: `Article ${feedback.toLowerCase()}d successfully.` });
  } catch (error) {
    handleError("submitting article feedback", error, res);
  }
}

export async function fetchFeedbackSortedArticles(req: AuthRequest, res: Response): Promise<void> {
  const sort = req.query.sort as string | undefined;
  const userId = req.user.id;

  if (!sort || !["like", "dislike"].includes(sort.toLowerCase())) {
    res.status(400).json({ message: "Sort must be 'like' or 'dislike'." });
    return;
  }

  try {
    const articles = await newsService.getFeedbackArticles(
      userId,
      sort.toUpperCase() as "LIKE" | "DISLIKE"
    );
    res.status(200).json(articles);
  } catch (error) {
    handleError("fetching sorted feedback", error, res);
  }
}

export async function reportArticle(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user.id;
  const articleId = parseInt(req.params.article_id);
  const { reason } = req.body;

  if (!reason || !reason.trim()) {
    res.status(400).json({ message: "Report reason is required." });
    return;
  }

  if (isNaN(articleId)) {
    res.status(400).json({ message: "Invalid article ID." });
    return;
  }

  try {
    await newsService.reportArticle(userId, articleId, reason);
    res.status(200).json({ message: "Article reported successfully." });
  } catch (error) {
    handleError("reporting article", error, res);
  }
}

function handleError(context: string, error: unknown, res: Response): void {
  console.error(`Error ${context}:`, error);
  res.status(500).json({ message: `Failed to ${context}` });
}

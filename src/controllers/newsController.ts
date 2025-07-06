import { Request, Response, RequestHandler } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import { NewsService } from "../services/newsService";

const newsService = new NewsService();

export async function fetchHeadlines(req: Request, res: Response): Promise<void> {
  try {
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    const category = req.query.category as string | undefined;
    const sortBy = req.query.sortBy as string | undefined;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    const [articles, total] = await Promise.all([
      newsService.getArticlesFromDB(startDate, endDate, category, sortBy, limit, offset),
      newsService.countArticles(startDate, endDate, category),
    ]);

    if (!articles || articles.length === 0) {
      res.status(204).send();
      return;
    }

    res.status(200).json({ articles, total });
  } catch (error) {
    handleError("fetching headlines", error, res);
  }
}


export async function saveUserArticle(
  req: AuthRequest,
  res: Response
): Promise<void> {
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

export async function fetchSavedArticles(
  req: AuthRequest,
  res: Response
): Promise<void> {
  const userId = req.user.id;

  try {
    const articles = await newsService.getSavedArticles(userId);
    res.status(200).json(articles);
  } catch (error) {
    handleError("fetching saved articles", error, res);
  }
}

export async function removeSavedArticle(
  req: AuthRequest,
  res: Response
): Promise<void> {
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

    if (!results || results.length === 0) {
      res.status(204).send();
      return;
    }

    res.status(200).json({ articles: results });
  } catch (error) {
    handleError("searching articles", error, res);
  }
};

export async function giveFeedbackOnArticle(
  req: AuthRequest,
  res: Response
): Promise<void> {
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
    res
      .status(200)
      .json({ message: `Article ${feedback.toLowerCase()}d successfully.` });
  } catch (error) {
    handleError("submitting article feedback", error, res);
  }
}

export async function fetchFeedbackSortedArticles(
  req: AuthRequest,
  res: Response
): Promise<void> {
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


export async function reportArticle(
  req: AuthRequest,
  res: Response
): Promise<void> {
  const userId = req.user.id;
  const articleId = parseInt(req.params.article_id);

  if (isNaN(articleId)) {
    res.status(400).json({ message: "Invalid article ID." });
    return;
  }

  const { reason, banKeywords } = req.body;

  if (!reason || typeof reason !== "string") {
    res
      .status(400)
      .json({ message: "Reason is required to report an article." });
    return;
  }

  if (banKeywords && !Array.isArray(banKeywords)) {
    res
      .status(400)
      .json({ message: "banKeywords must be an array of strings." });
    return;
  }

  try {
    await newsService.reportArticle(userId, articleId, reason, banKeywords);
    res.status(200).json({ message: "Article reported successfully." });
  } catch (error: any) {
    if (error.message.includes("already reported")) {
      res.status(409).json({ message: error.message });
    } else {
      handleError("reporting article", error, res);
    }
  }
}

function handleError(context: string, error: unknown, res: Response): void {
  console.error(`Error ${context}:`, error);
  res.status(500).json({ message: `Failed to ${context}` });
}

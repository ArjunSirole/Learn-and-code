import { Router } from "express";
import {
  fetchHeadlines,
  saveUserArticle,
  fetchSavedArticles,
  searchArticles,
  giveFeedbackOnArticle,
  fetchFeedbackSortedArticles,
  removeSavedArticle,
  reportArticle,
  fetchRecommendedArticles,
} from "../controllers/newsController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

router.get("/headlines", fetchHeadlines);
router.post("/save", verifyToken, saveUserArticle);
router.get("/saved", verifyToken, fetchSavedArticles);
router.get("/search", searchArticles);
router.post("/:article_id/feedback", verifyToken, giveFeedbackOnArticle);
router.get("/sorted-feedback", verifyToken, fetchFeedbackSortedArticles);
router.delete("/saved/:articleId", verifyToken, removeSavedArticle);
router.post("/:article_id/report", verifyToken, reportArticle);
router.get("/recommended", verifyToken, fetchRecommendedArticles);

export default router;

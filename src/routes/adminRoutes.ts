import { Router } from "express";
import {
  fetchServers,
  fetchServerDetails,
  updateServerApiKey,
  createCategory,
  deleteUser,
  deactivateUser,
  reactivateUser,
  updateUserRole,
  logoutAdmin,
  fetchUserMetrics,
  fetchNewsMetrics,
  fetchReportedArticles,
  hideArticle,
  dismissReport,
  fetchCategories,
  hideCategory,
  unhideCategory,
  addBannedKeyword,
  deleteBannedKeyword,
  fetchBannedKeywords,
  fetchAllUsers,
  disableBannedKeyword,
  enableBannedKeyword,
  unhideArticle,
} from "../controllers/adminController";

const router = Router();

router.get("/servers", fetchServers);
router.get("/servers/:id", fetchServerDetails);
router.put("/servers/:id/apikey", updateServerApiKey);

router.post("/categories", createCategory);

router.get("/users", fetchAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id/deactivate", deactivateUser);
router.put("/users/:id/reactivate", reactivateUser);
router.put("/users/:id/role", updateUserRole);

router.get("/metrics/users", fetchUserMetrics);
router.get("/metrics/news", fetchNewsMetrics);

router.get("/reports", fetchReportedArticles);
router.put("/articles/:id/hide", hideArticle);
router.put("/reports/:id/dismiss", dismissReport);

router.get("/categories", fetchCategories);
router.put("/categories/:name/hide", hideCategory);
router.put("/categories/:name/unhide", unhideCategory);
router.get("/banned-keywords", fetchBannedKeywords);
router.post("/banned-keywords", addBannedKeyword);
router.delete("/banned-keywords/:id", deleteBannedKeyword);
router.put("/banned-keywords/:id/enable", enableBannedKeyword);
router.put("/banned-keywords/:id/disable", disableBannedKeyword);
router.put("/admin/articles/:id/unhide", unhideArticle);

router.post("/logout", logoutAdmin);

export default router;

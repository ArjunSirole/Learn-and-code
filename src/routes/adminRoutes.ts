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
} from "../controllers/adminController";

const router = Router();

router.get("/servers", fetchServers);
router.get("/servers/:id", fetchServerDetails);
router.put("/servers/:id/apikey", updateServerApiKey);

router.post("/categories", createCategory);

router.delete("/users/:id", deleteUser);
router.put("/users/:id/deactivate", deactivateUser);
router.put("/users/:id/reactivate", reactivateUser);
router.put("/users/:id/role", updateUserRole);

router.get("/metrics/users", fetchUserMetrics);
router.get("/metrics/news", fetchNewsMetrics);

router.post("/logout", logoutAdmin);

export default router;

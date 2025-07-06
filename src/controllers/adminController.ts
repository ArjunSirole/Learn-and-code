import { Request, Response } from "express";
import { AdminService } from "../services/adminService";
import { UserService } from "../services/userService";

const adminService = new AdminService();
const userService = new UserService();

export async function fetchServers(req: Request, res: Response): Promise<void> {
  try {
    const servers = await adminService.fetchServers();
    res.status(200).json(servers);
  } catch (error) {
    handleServerError(res, "fetching servers", error);
  }
}

export async function fetchServerDetails(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  try {
    const server = await adminService.fetchServerById(id);
    if (!server.length) {
      res.status(404).json({ message: "Server not found" });
    }
    res.status(200).json(server[0]);
  } catch (error) {
    handleServerError(res, "fetching server details", error);
  }
}

export async function updateServerApiKey(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  const { apiKey } = req.body;

  if (!apiKey) {
    res.status(400).json({ message: "API key is required" });
  }

  try {
    const result = await adminService.updateServerKey(id, apiKey);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Server not found" });
    }

    res.status(200).json({ message: "API key updated successfully" });
  } catch (error) {
    handleServerError(res, "updating API key", error);
  }
}

export async function fetchAllUsers(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("[AdminController.fetchAllUsers]:", error);
    res.status(500).json({ message: "Failed to fetch users." });
  }
}

export async function createCategory(
  req: Request,
  res: Response
): Promise<void> {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ message: "Category name is required" });
  }

  try {
    await adminService.insertCategory(name);
    res.status(201).json({ message: "Category added successfully" });
  } catch (error) {
    handleServerError(res, "adding category", error);
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  const userId = Number(req.params.id);

  try {
    await adminService.removeNotificationConfig(userId);
    const result = await adminService.removeUser(userId);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    handleServerError(res, "deleting user", error);
  }
}

export async function deactivateUser(
  req: Request,
  res: Response
): Promise<void> {
  await toggleUserStatus(req, res, false, "deactivate");
}

export async function reactivateUser(
  req: Request,
  res: Response
): Promise<void> {
  await toggleUserStatus(req, res, true, "reactivate");
}

export async function updateUserRole(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  const { role } = req.body;

  if (!["USER", "ADMIN"].includes(role)) {
    res.status(400).json({ message: "Invalid role provided" });
  }

  try {
    const result = await adminService.modifyUserRole(id, role);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: `User role updated to ${role}` });
  } catch (error) {
    handleServerError(res, "updating user role", error);
  }
}

export async function fetchUserMetrics(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const metrics = await adminService.getUserStats();
    res.status(200).json(metrics);
  } catch (error) {
    handleServerError(res, "fetching user metrics", error);
  }
}

export async function fetchNewsMetrics(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const metrics = await adminService.getNewsStats();
    res.status(200).json(metrics);
  } catch (error) {
    handleServerError(res, "fetching news metrics", error);
  }
}

export function logoutAdmin(req: Request, res: Response): void {
  res.status(200).json({ message: "Logged out successfully" });
}

async function toggleUserStatus(
  req: Request,
  res: Response,
  isActive: boolean,
  action: string
): Promise<void> {
  const { id } = req.params;

  try {
    const result = await adminService.setActiveStatus(id, isActive);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: `User ${action}d successfully` });
  } catch (error) {
    handleServerError(res, `${action}ing user`, error);
  }
}

export async function fetchReportedArticles(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const reports = await adminService.getReportedArticles();
    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reported articles:", error);
    res.status(500).json({ message: "Failed to fetch reported articles" });
  }
}

export async function hideArticle(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  try {
    await adminService.hideArticle(Number(id));
    res.status(200).json({ message: "Article hidden successfully" });
  } catch (error) {
    handleServerError(res, "hiding article", error);
  }
}

export async function dismissReport(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  try {
    await adminService.dismissReport(Number(id));
    res.status(200).json({ message: "Report dismissed successfully" });
  } catch (error) {
    handleServerError(res, "dismissing report", error);
  }
}

export async function hideCategory(req: Request, res: Response): Promise<void> {
  const { name } = req.params;
  try {
    const result = await adminService.hideCategory(name);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.status(200).json({ message: "Category hidden successfully" });
  } catch (error) {
    handleServerError(res, "hiding category", error);
  }
}

export async function unhideCategory(
  req: Request,
  res: Response
): Promise<void> {
  const { name } = req.params;
  try {
    const result = await adminService.unhideCategory(name);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Category not found" });
      return;
    }
    res.status(200).json({ message: "Category unhidden successfully" });
  } catch (error) {
    handleServerError(res, "unhiding category", error);
  }
}

export async function fetchCategories(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const categories = await adminService.getCategoriesFromArticles();
    res.status(200).json(categories);
  } catch (error) {
    handleServerError(res, "fetching categories", error);
  }
}

export async function fetchAllCategories(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const categories = await adminService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error("[Controller] Failed to fetch all categories:", error);
    res.status(500).json({ message: "Failed to fetch categories." });
  }
}



export async function fetchBannedKeywords(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const keywords = await adminService.getBannedKeywords();
    res.status(200).json(keywords);
  } catch (error) {
    handleServerError(res, "fetching banned keywords", error);
  }
}

export async function addBannedKeyword(
  req: Request,
  res: Response
): Promise<void> {
  const { keyword } = req.body;
  if (!keyword || typeof keyword !== "string") {
    res.status(400).json({ message: "Keyword is required" });
    return;
  }
  try {
    await adminService.addBannedKeyword(keyword);
    res.status(201).json({ message: "Keyword added successfully" });
  } catch (error) {
    handleServerError(res, "adding banned keyword", error);
  }
}

export async function deleteBannedKeyword(
  req: Request,
  res: Response
): Promise<void> {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid keyword ID" });
    return;
  }
  try {
    const result = await adminService.removeBannedKeyword(id);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Keyword not found" });
      return;
    }
    res.status(200).json({ message: "Keyword deleted successfully" });
  } catch (error) {
    handleServerError(res, "deleting banned keyword", error);
  }
}

export async function enableBannedKeyword(
  req: Request,
  res: Response
): Promise<void> {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid keyword ID" });
    return;
  }
  try {
    const result = await adminService.enableBannedKeyword(id);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Keyword not found" });
      return;
    }
    res.status(200).json({ message: "Keyword enabled successfully" });
  } catch (error) {
    handleServerError(res, "enabling banned keyword", error);
  }
}

export async function disableBannedKeyword(
  req: Request,
  res: Response
): Promise<void> {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid keyword ID" });
    return;
  }
  try {
    const result = await adminService.disableBannedKeyword(id);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Keyword not found" });
      return;
    }
    res.status(200).json({ message: "Keyword disabled successfully" });
  } catch (error) {
    handleServerError(res, "disabling banned keyword", error);
  }
}

export async function unhideArticle(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  try {
    await adminService.unhideArticle(Number(id));
    res.status(200).json({ message: "Article unhidden successfully" });
  } catch (error) {
    handleServerError(res, "unhiding article", error);
  }
}

function handleServerError(
  res: Response,
  context: string,
  error: unknown
): void {
  console.error(`Error ${context}:`, error);
  res.status(500).json({ message: `Failed to ${context}` });
}

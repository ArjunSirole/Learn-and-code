import { Request, Response } from "express";
import { AdminService } from "../services/adminService";

const adminService = new AdminService();

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

function handleServerError(
  res: Response,
  context: string,
  error: unknown
): void {
  console.error(`Error ${context}:`, error);
  res.status(500).json({ message: `Failed to ${context}` });
}

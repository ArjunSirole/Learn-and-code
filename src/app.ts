import express, { Application } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import newsRoutes from "./routes/newsRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import adminRoutes from "./routes/adminRoutes";

import { NewsScheduler } from "./schedulers/newsScheduler";
import { EmailScheduler } from "./schedulers/emailScheduler";

export class Server {
  public app: Application;

  private newsScheduler = new NewsScheduler();
  private emailScheduler = new EmailScheduler();

  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
    this.startSchedulers();
  }

  private configureMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private configureRoutes(): void {
    this.app.use("/auth", authRoutes);
    this.app.use("/news", newsRoutes);
    this.app.use("/notifications", notificationRoutes);
    this.app.use("/admin", adminRoutes);
  }

  private startSchedulers(): void {
    this.newsScheduler.start();
    this.emailScheduler.start();
  }

  public getApp(): Application {
    return this.app;
  }
}

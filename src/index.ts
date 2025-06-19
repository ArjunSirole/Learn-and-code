import dotenv from "dotenv";
dotenv.config();

import { Server } from "./app";

const PORT = process.env.PORT || 3000;

const server = new Server();
const app = server.getApp();

app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});

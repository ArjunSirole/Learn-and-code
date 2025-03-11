// src/app.ts
import express from "express";
import bodyParser from "body-parser";
import orderRoutes from "./routes/orderRoutes";

const app = express();
app.use(bodyParser.json());
app.use("/api", orderRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

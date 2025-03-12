import express from "express";
import bodyParser from "body-parser";
import { createOrder } from "./order";

const app = express();
app.use(bodyParser.json());

app.post("/api/checkout", createOrder);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

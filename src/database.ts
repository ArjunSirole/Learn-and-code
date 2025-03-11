// src/database.ts
import mysql from "mysql2/promise";
import { config } from "./config";

export const db = mysql.createPool(config.db);

import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  app.post("/api/contact", async (req, res) => {
    try {
      const message = insertMessageSchema.parse(req.body);
      const result = await storage.createMessage(message);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid message data" });
    }
  });

  return createServer(app);
}

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChequeRecordSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Create a new cheque record (audit trail)
  app.post("/api/cheque-records", async (req, res) => {
    try {
      const validatedData = insertChequeRecordSchema.parse(req.body);
      const record = await storage.createChequeRecord(validatedData);
      res.json(record);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get all cheque records (for analytics/audit)
  app.get("/api/cheque-records", async (req, res) => {
    try {
      const records = await storage.getAllChequeRecords();
      res.json(records);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}

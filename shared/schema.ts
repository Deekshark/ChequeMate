import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Cheque Records for audit trail
export const chequeRecords = pgTable("cheque_records", {
  id: serial("id").primaryKey(),
  payeeName: text("payee_name").notNull(),
  amountFigures: text("amount_figures").notNull(),
  amountWords: text("amount_words").notNull(),
  date: text("date").notNull(),
  accountNumber: text("account_number").notNull(),
  printedAt: timestamp("printed_at").defaultNow().notNull(),
});

export const insertChequeRecordSchema = createInsertSchema(chequeRecords).omit({
  id: true,
  printedAt: true,
});

export type InsertChequeRecord = z.infer<typeof insertChequeRecordSchema>;
export type ChequeRecord = typeof chequeRecords.$inferSelect;

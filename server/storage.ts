import { users, chequeRecords, type User, type InsertUser, type ChequeRecord, type InsertChequeRecord } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createChequeRecord(record: InsertChequeRecord): Promise<ChequeRecord>;
  getAllChequeRecords(): Promise<ChequeRecord[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createChequeRecord(record: InsertChequeRecord): Promise<ChequeRecord> {
    const [chequeRecord] = await db
      .insert(chequeRecords)
      .values(record)
      .returning();
    return chequeRecord;
  }

  async getAllChequeRecords(): Promise<ChequeRecord[]> {
    return await db
      .select()
      .from(chequeRecords)
      .orderBy(desc(chequeRecords.printedAt));
  }
}

export const storage = new DatabaseStorage();

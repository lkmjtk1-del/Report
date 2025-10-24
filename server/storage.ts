import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserVerification(id: string, isVerified: boolean): Promise<User | undefined>;
  storeOtp(userId: string, otp: string): Promise<void>;
  getOtp(userId: string): Promise<string | undefined>;
  clearOtp(userId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private otps: Map<string, string>;

  constructor() {
    this.users = new Map();
    this.otps = new Map();
    
    const testUser: User = {
      id: "test-user-id",
      email: "test@shamcash.com",
      password: "123456",
      pin: "1234",
      phone: "+966500000000",
      isVerified: false,
      createdAt: new Date(),
    };
    this.users.set(testUser.id, testUser);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      isVerified: false,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserVerification(id: string, isVerified: boolean): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      user.isVerified = isVerified;
      this.users.set(id, user);
      return user;
    }
    return undefined;
  }

  async storeOtp(userId: string, otp: string): Promise<void> {
    this.otps.set(userId, otp);
  }

  async getOtp(userId: string): Promise<string | undefined> {
    return this.otps.get(userId);
  }

  async clearOtp(userId: string): Promise<void> {
    this.otps.delete(userId);
  }
}

export const storage = new MemStorage();

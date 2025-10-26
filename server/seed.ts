// Seed admin accounts for production
import { db } from "./db";
import { admins } from "@shared/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Starting database seed...");

  const adminAccounts = [
    { username: "masrivi_1", password: "22224545", role: "staff" },
    { username: "masrivi_2", password: "22224545", role: "staff" },
    { username: "masrivi_3", password: "22224545", role: "staff" },
    { username: "masrivi_4", password: "X123456n", role: "admin" },
  ];

  for (const account of adminAccounts) {
    try {
      // Check if admin already exists
      const existing = await db
        .select()
        .from(admins)
        .where(eq(admins.username, account.username))
        .limit(1);

      if (existing.length > 0) {
        console.log(`⚠️  Admin ${account.username} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(account.password, 10);

      // Insert admin
      await db.insert(admins).values({
        username: account.username,
        password: hashedPassword,
        role: account.role,
      });

      console.log(`✅ Created ${account.role}: ${account.username}`);
    } catch (error) {
      console.error(`❌ Failed to create ${account.username}:`, error);
    }
  }

  console.log("🎉 Database seed completed!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});

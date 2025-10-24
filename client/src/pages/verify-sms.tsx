import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { verifyOtpSchema, type VerifyOtpData } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Shield, Loader2, Smartphone } from "lucide-react";
import logoImage from "@assets/IMG_0350_1761335875653.jpeg";

export default function VerifySms() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [countdown, setCountdown] = useState(60);
  
  // Get userId from URL
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId");

  useEffect(() => {
    if (!userId) {
      setLocation("/login");
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [userId, setLocation]);

  const form = useForm<VerifyOtpData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      userId: userId || "",
      otp: "",
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (data: VerifyOtpData) => {
      const res = await apiRequest("POST", "/api/auth/verify-otp", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "تم التحقق بنجاح! ✓",
        description: "سيتم توجيهك إلى لوحة التحكم",
      });
      setTimeout(() => {
        setLocation("/dashboard");
      }, 1500);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "خطأ في التحقق",
        description: error.message || "رمز التحقق غير صحيح",
      });
    },
  });

  const resendMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/resend-otp", { userId });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "تم إعادة الإرسال",
        description: "تحقق من هاتفك مرة أخرى",
      });
      setCountdown(60);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.message || "فشل إعادة إرسال الرمز",
      });
    },
  });

  const onSubmit = (data: VerifyOtpData) => {
    verifyMutation.mutate(data);
  };

  const handleResend = () => {
    if (countdown > 0) return;
    resendMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4" dir="rtl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src={logoImage} 
            alt="شام كاش" 
            className="w-20 h-20 object-contain"
            data-testid="logo-verify"
          />
        </div>

        {/* Verify Card */}
        <div className="bg-card border border-border rounded-lg p-8 space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-primary" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-foreground" data-testid="text-verify-title">
              تحقق من رمز SMS
            </h1>
            <p className="text-muted-foreground text-sm">
              أدخل الرمز المكون من 6 أرقام المرسل إلى هاتفك
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* OTP Field */}
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رمز التحقق</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="000000"
                        maxLength={6}
                        className="text-center text-2xl tracking-widest font-bold"
                        data-testid="input-otp"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={verifyMutation.isPending}
                data-testid="button-verify-submit"
              >
                {verifyMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري التحقق...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 ml-2" />
                    تأكيد الرمز
                  </>
                )}
              </Button>
            </form>
          </Form>

          {/* Resend */}
          <div className="text-center space-y-3 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              لم تستلم الرمز؟
            </p>
            <Button
              variant="ghost"
              onClick={handleResend}
              disabled={countdown > 0 || resendMutation.isPending}
              data-testid="button-resend-otp"
            >
              {countdown > 0 ? (
                `إعادة الإرسال خلال ${countdown} ثانية`
              ) : resendMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                "إعادة إرسال الرمز"
              )}
            </Button>
          </div>

          {/* Back to Login */}
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => setLocation("/login")}
              data-testid="button-back-login"
            >
              العودة لتسجيل الدخول
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

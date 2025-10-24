import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics";

export default function Privacy() {
  useEffect(() => {
    trackPageView("/privacy", "سياسة الخصوصية - شام كاش");
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Button
              size="icon"
              variant="ghost"
              className="hover-elevate active-elevate-2"
              asChild
              data-testid="button-back-home"
            >
              <Link href="/">
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>

            <div className="absolute left-1/2 -translate-x-1/2" data-testid="logo-shamcash">
              <Link href="/">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center cursor-pointer">
                    <span className="text-primary-foreground font-bold text-lg">SC</span>
                  </div>
                </div>
              </Link>
            </div>

            <div className="w-10"></div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-12">
            {/* Title */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold" data-testid="text-privacy-title">
                سياسة <span className="text-primary">الخصوصية</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                آخر تحديث: أكتوبر 2025
              </p>
            </div>

            {/* Introduction */}
            <section className="space-y-4">
              <p className="text-lg text-foreground leading-relaxed">
                نحن في شام كاش نقدر خصوصيتك ونلتزم بحماية معلوماتك الشخصية. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية البيانات التي تقدمها لنا عند استخدام تطبيقنا وخدماتنا.
              </p>
            </section>

            {/* Section 1 */}
            <section className="space-y-4" data-testid="section-data-collection">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                1. المعلومات التي نجمعها
              </h2>
              <div className="space-y-3 text-muted-foreground text-lg leading-relaxed">
                <p>نقوم بجمع أنواع مختلفة من المعلومات لتقديم خدماتنا وتحسينها:</p>
                <ul className="mr-8 space-y-2 list-disc">
                  <li><strong className="text-foreground">المعلومات الشخصية:</strong> الاسم، رقم الهاتف، البريد الإلكتروني، وتاريخ الميلاد.</li>
                  <li><strong className="text-foreground">المعلومات المالية:</strong> تفاصيل الحسابات البنكية والمعاملات المالية.</li>
                  <li><strong className="text-foreground">معلومات الجهاز:</strong> نوع الجهاز، نظام التشغيل، عنوان IP، ومعرف الجهاز الفريد.</li>
                  <li><strong className="text-foreground">بيانات الاستخدام:</strong> كيفية استخدامك للتطبيق والخدمات المقدمة.</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-4" data-testid="section-data-usage">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                2. كيفية استخدام معلوماتك
              </h2>
              <div className="space-y-3 text-muted-foreground text-lg leading-relaxed">
                <p>نستخدم المعلومات التي نجمعها للأغراض التالية:</p>
                <ul className="mr-8 space-y-2 list-disc">
                  <li>تقديم وتحسين خدماتنا المالية</li>
                  <li>معالجة المعاملات المالية بشكل آمن</li>
                  <li>التواصل معك بشأن حسابك والخدمات</li>
                  <li>منع الاحتيال وضمان أمان المنصة</li>
                  <li>الامتثال للمتطلبات القانونية والتنظيمية</li>
                  <li>تحليل وتحسين تجربة المستخدم</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-4" data-testid="section-data-protection">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                3. حماية معلوماتك
              </h2>
              <div className="space-y-3 text-muted-foreground text-lg leading-relaxed">
                <p>نتخذ إجراءات أمنية صارمة لحماية معلوماتك الشخصية:</p>
                <ul className="mr-8 space-y-2 list-disc">
                  <li>تشفير البيانات باستخدام بروتوكولات SSL/TLS المتقدمة</li>
                  <li>مصادقة ثنائية العامل لحماية حسابك</li>
                  <li>مراقبة مستمرة للأنشطة المشبوهة</li>
                  <li>تخزين آمن للبيانات في خوادم محمية</li>
                  <li>تدريب موظفينا على أفضل ممارسات أمن المعلومات</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-4" data-testid="section-data-sharing">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                4. مشاركة المعلومات
              </h2>
              <div className="space-y-3 text-muted-foreground text-lg leading-relaxed">
                <p>لا نبيع معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك في الحالات التالية فقط:</p>
                <ul className="mr-8 space-y-2 list-disc">
                  <li>مع مزودي الخدمات الموثوقين الذين يساعدوننا في تشغيل التطبيق</li>
                  <li>للامتثال للقوانين واللوائح المعمول بها</li>
                  <li>لحماية حقوقنا وسلامة مستخدمينا</li>
                  <li>في حالة اندماج أو استحواذ (بعد إشعارك)</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section className="space-y-4" data-testid="section-user-rights">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                5. حقوقك
              </h2>
              <div className="space-y-3 text-muted-foreground text-lg leading-relaxed">
                <p>لديك الحقوق التالية فيما يتعلق بمعلوماتك الشخصية:</p>
                <ul className="mr-8 space-y-2 list-disc">
                  <li>الوصول إلى معلوماتك الشخصية ومراجعتها</li>
                  <li>تصحيح المعلومات غير الدقيقة</li>
                  <li>حذف حسابك ومعلوماتك الشخصية</li>
                  <li>الاعتراض على معالجة معلوماتك في ظروف معينة</li>
                  <li>تقييد معالجة معلوماتك</li>
                  <li>نقل بياناتك إلى خدمة أخرى</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                6. ملفات تعريف الارتباط (Cookies)
              </h2>
              <div className="space-y-3 text-muted-foreground text-lg leading-relaxed">
                <p>نستخدم ملفات تعريف الارتباط والتقنيات المشابهة لتحسين تجربتك وتحليل استخدام التطبيق. يمكنك التحكم في إعدادات ملفات تعريف الارتباط من خلال متصفحك.</p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                7. التحديثات على سياسة الخصوصية
              </h2>
              <div className="space-y-3 text-muted-foreground text-lg leading-relaxed">
                <p>قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإشعارك بأي تغييرات جوهرية عبر التطبيق أو البريد الإلكتروني. استمرار استخدامك للتطبيق بعد التحديثات يعني موافقتك على السياسة المحدثة.</p>
              </div>
            </section>

            {/* Contact */}
            <section className="space-y-4 border-t border-border pt-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                تواصل معنا
              </h2>
              <div className="space-y-3 text-muted-foreground text-lg leading-relaxed">
                <p>إذا كانت لديك أي أسئلة أو استفسارات حول سياسة الخصوصية، يرجى التواصل معنا:</p>
                <ul className="mr-8 space-y-2">
                  <li><strong className="text-foreground">البريد الإلكتروني:</strong> privacy@shamcash.com</li>
                  <li><strong className="text-foreground">الهاتف:</strong> +963 XX XXX XXXX</li>
                  <li><strong className="text-foreground">العنوان:</strong> دمشق، سوريا</li>
                </ul>
              </div>
            </section>

            {/* Back Button */}
            <div className="flex justify-center pt-8">
              <Button
                size="lg"
                variant="outline"
                className="min-w-[200px] hover-elevate active-elevate-2"
                asChild
                data-testid="button-back-home-bottom"
              >
                <Link href="/">
                  <ArrowRight className="w-5 h-5 ml-2" />
                  <span>العودة للصفحة الرئيسية</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground">
            &copy; 2025 شام كاش. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}

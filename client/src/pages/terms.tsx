import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useEffect } from "react";
import { trackPageView } from "@/lib/analytics";

export default function Terms() {
  useEffect(() => {
    trackPageView("/terms", "الشروط والأحكام - شام كاش");
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
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold" data-testid="text-terms-title">
                الشروط <span className="text-primary">والأحكام</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                آخر تحديث: أكتوبر 2025
              </p>
            </div>

            {/* Introduction */}
            <section className="space-y-4">
              <p className="text-lg text-foreground leading-relaxed">
                مرحباً بك في شام كاش. باستخدامك لتطبيقنا وخدماتنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. يرجى قراءتها بعناية قبل البدء باستخدام خدماتنا.
              </p>
            </section>

            {/* Section 1 */}
            <section className="space-y-4" data-testid="section-acceptance">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                1. قبول الشروط
              </h2>
              <div className="space-y-3 text-muted-foreground text-lg leading-relaxed">
                <p>
                  من خلال الوصول إلى تطبيق شام كاش أو استخدامه، فإنك توافق على الالتزام بهذه الشروط والأحكام وجميع القوانين واللوائح المعمول بها. إذا كنت لا توافق على أي من هذه الشروط، يُمنع عليك استخدام هذا التطبيق.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-4" data-testid="section-services">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                2. الخدمات المقدمة
              </h2>
              <div className="space-y-3 text-muted-foreground text-lg leading-relaxed">
                <p>يوفر شام كاش خدمات مالية تشمل:</p>
                <ul className="mr-8 space-y-2 list-disc">
                  <li>إرسال واستقبال الأموال بين المستخدمين</li>
                  <li>إدارة الحسابات والمحافظ الرقمية</li>
                  <li>تحويل الأموال إلى حسابات بنكية</li>
                  <li>دفع الفواتير والخدمات</li>
                  <li>إدارة وتتبع المعاملات المالية</li>
                </ul>
                <p>
                  نحتفظ بالحق في تعديل أو إيقاف أي خدمة في أي وقت دون إشعار مسبق.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="space-y-4" data-testid="section-account">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                3. حساب المستخدم
              </h2>
              <div className="space-y-3 text-muted-foreground text-lg leading-relaxed">
                <p>لاستخدام خدماتنا، يجب عليك:</p>
                <ul className="mr-8 space-y-2 list-disc">
                  <li>أن تكون بالغاً من العمر 18 عاماً على الأقل</li>
                  <li>تقديم معلومات دقيقة وكاملة عند التسجيل</li>
                  <li>الحفاظ على سرية كلمة المرور الخاصة بك</li>
                  <li>إخطارنا فوراً بأي استخدام غير مصرح به لحسابك</li>
                  <li>تحديث معلوماتك الشخصية عند تغييرها</li>
                </ul>
                <p>
                  أنت مسؤول عن جميع الأنشطة التي تحدث تحت حسابك. نحتفظ بالحق في تعليق أو إنهاء حسابك إذا انتهكت هذه الشروط.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-4" data-testid="section-transactions">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                4. المعاملات المالية
              </h2>
              <div className="space-y-3 text-muted-foreground text-lg leading-relaxed">
                <p>عند إجراء معاملات مالية عبر التطبيق:</p>
                <ul className="mr-8 space-y-2 list-disc">
                  <li>يجب التأكد من دقة جميع تفاصيل المعاملة قبل التأكيد</li>
                  <li>المعاملات المكتملة لا يمكن إلغاؤها إلا بموافقة الطرفين</li>
                  <li>قد تخضع بعض المعاملات لرسوم خدمة معلنة</li>
                  <li>يجب أن يكون لديك رصيد كافٍ لإتمام المعاملة</li>
                  <li>نحتفظ بالحق في رفض أو إلغاء المعاملات المشبوهة</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section className="space-y-4" data-testid="section-fees">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                5. الرسوم والتكاليف
              </h2>
              <div className="space-y-3 text-muted-foreground text-lg leading-relaxed">
                <p>
                  قد نفرض رسوماً على بعض الخدمات. سيتم إعلامك بأي رسوم قبل إتمام المعاملة. تشمل الرسوم المحتملة:
                </p>
                <ul className="mr-8 space-y-2 list-disc">
                  <li>رسوم تحويل الأموال إلى حسابات بنكية</li>
                  <li>رسوم السحب النقدي</li>
                  <li>رسوم المعاملات الدولية</li>
                  <li>رسوم خدمات إضافية متميزة</li>
                </ul>
                <p>نحتفظ بالحق في تغيير هيكل الرسوم في أي وقت بعد إشعارك.</p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="space-y-4" data-testid="section-prohibited">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                6. الاستخدامات المحظورة
              </h2>
              <div className="space-y-3 text-muted-foreground text-lg leading-relaxed">
                <p>يُحظر عليك استخدام التطبيق لـ:</p>
                <ul className="mr-8 space-y-2 list-disc">
                  <li>أي أنشطة غير قانونية أو احتيالية</li>
                  <li>غسيل الأموال أو تمويل الإرهاب</li>
                  <li>انتهاك حقوق الملكية الفكرية</li>
                  <li>نشر برامج ضارة أو فيروسات</li>
                  <li>محاولة الوصول غير المصرح به إلى أنظمتنا</li>
                  <li>التلاعب بالمعاملات أو الأسعار</li>
                </ul>
              </div>
            </section>

            {/* Section 7 */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                7. المسؤولية وإخلاء المسؤولية
              </h2>
              <div className="space-y-3 text-muted-foreground text-lg leading-relaxed">
                <p>
                  نبذل قصارى جهدنا لتوفير خدمة موثوقة وآمنة، ولكننا لا نضمن عمل التطبيق دون انقطاع أو خلوه من الأخطاء. لا نتحمل المسؤولية عن:
                </p>
                <ul className="mr-8 space-y-2 list-disc">
                  <li>الأضرار الناتجة عن استخدام أو عدم القدرة على استخدام التطبيق</li>
                  <li>الخسائر المالية الناتجة عن أخطاء المستخدم</li>
                  <li>الانقطاعات المؤقتة للخدمة لأسباب فنية</li>
                  <li>تصرفات المستخدمين الآخرين</li>
                </ul>
              </div>
            </section>

            {/* Section 8 */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                8. التعديلات على الشروط
              </h2>
              <div className="space-y-3 text-muted-foreground text-lg leading-relaxed">
                <p>
                  نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت. سيتم نشر التعديلات على هذه الصفحة وإشعارك عبر التطبيق. استمرارك في استخدام التطبيق بعد التعديلات يعني قبولك للشروط المحدثة.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                9. إنهاء الخدمة
              </h2>
              <div className="space-y-3 text-muted-foreground text-lg leading-relaxed">
                <p>
                  يمكنك إنهاء حسابك في أي وقت من خلال إعدادات التطبيق. نحتفظ بالحق في تعليق أو إنهاء حسابك فوراً إذا انتهكت هذه الشروط أو إذا اشتبهنا في أنشطة احتيالية.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                10. القانون الحاكم
              </h2>
              <div className="space-y-3 text-muted-foreground text-lg leading-relaxed">
                <p>
                  تخضع هذه الشروط والأحكام للقوانين المعمول بها في الجمهورية العربية السورية. أي نزاعات تنشأ عن استخدام التطبيق ستحل عبر المحاكم المختصة في دمشق.
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="space-y-4 border-t border-border pt-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                تواصل معنا
              </h2>
              <div className="space-y-3 text-muted-foreground text-lg leading-relaxed">
                <p>إذا كانت لديك أي أسئلة حول الشروط والأحكام، يرجى التواصل معنا:</p>
                <ul className="mr-8 space-y-2">
                  <li><strong className="text-foreground">البريد الإلكتروني:</strong> support@shamcash.com</li>
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

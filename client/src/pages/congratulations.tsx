import { useEffect } from "react";
import congratsImage from "@assets/generated_images/Arabic_contest_congratulations_image_0c809feb.png";
import logoImage from "@assets/IMG_0350_1761335875653.jpeg";
import { trackPageView } from "@/lib/analytics";

export default function Congratulations() {
  useEffect(() => {
    trackPageView("/congratulations", "شام كاش - مبروك");
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8" dir="rtl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl space-y-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src={logoImage} 
            alt="شام كاش" 
            className="w-20 h-20 object-contain"
            data-testid="logo-congratulations"
          />
        </div>

        {/* Congratulations Image */}
        <div className="w-full rounded-lg overflow-hidden border border-border shadow-2xl">
          <img 
            src={congratsImage} 
            alt="مبروك لقد تم تسجيلك في المسابقة" 
            className="w-full h-auto object-cover"
            data-testid="img-congratulations"
          />
        </div>

        {/* Additional Message */}
        <div className="text-center space-y-4 mt-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary" data-testid="text-congrats-title">
            مبروك
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-congrats-description">
            لقد تم تسجيلك في المسابقة بنجاح
          </p>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            سيتم التواصل معك قريباً عبر البريد الإلكتروني
          </p>
        </div>
      </div>
    </div>
  );
}

import { Tajawal } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
const tajawal = Tajawal({ subsets: ["arabic"], weight: ["400", "500", "700", "800"] });
export const metadata = { title: "شعبتي — اعرف قبل ما تقفل", description: "مساعد ذكي يمنع صدمة التسجيل الجامعي" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={tajawal.className}>{children}<Toaster position="top-center" richColors /></body>
    </html>
  );
}

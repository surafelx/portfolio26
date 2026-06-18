import { Providers } from "./providers";
import { MainLayout } from "@/layouts/MainLayout";
import { ScrollToTop } from "@/components/ScrollToTop";
import { BackgroundFX } from "@/components/BackgroundFX";
import "../src/index.css";

export const metadata = {
  title: "Surafel Yimam",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-MPNN4GQ10S"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-MPNN4GQ10S');
            `,
          }}
        />
      </head>
      <body>
        <BackgroundFX />
        <ScrollToTop />
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
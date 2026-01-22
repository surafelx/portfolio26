import { Providers } from "./providers";
import { MainLayout } from "@/layouts/MainLayout";
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
    <html lang="en">
      <body>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
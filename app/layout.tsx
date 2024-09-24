import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "코어 출석 관리 시스템",
  description: "built by CORE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

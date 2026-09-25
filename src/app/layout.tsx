import { Geist, Inter } from "next/font/google";
import { cookies } from "next/headers";

import { Providers } from "@/components/providers";
import { createMetadata } from "@/lib/seo";
import { THEME_COOKIE, resolveTheme } from "@/lib/theme/selection";

import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = createMetadata();

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = resolveTheme(cookieStore.get(THEME_COOKIE)?.value);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-preset={theme.preset}
      data-font={theme.font}
      data-radius={theme.radius}
      data-scale={theme.scale}
      data-content={theme.contentLayout}
      data-sidebar={theme.sidebar}
      data-sidebar-style={theme.sidebarStyle}
      data-shadow={theme.shadow}
      data-density={theme.density}
      data-contrast={theme.contrast}
      className={`${geist.variable} ${inter.variable}`}
    >
      <body>
        <Providers theme={theme}>{children}</Providers>
      </body>
    </html>
  );
}

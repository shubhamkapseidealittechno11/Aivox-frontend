import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";

import { ThemeProvider } from "@/providers/theme-provider";
import StoreProvider from "@/lib/StoreProvider";
import AuthWrapper from "@/lib/AuthWrapper";
import { Toaster } from "@/components/ui/toaster";
import { RolePermissionProvider } from "@/context/RolePermissionContext";
import { AuthProvider } from "@/context/AuthContext";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.APP_URL
      ? `${process.env.APP_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT || 3000}`
  ),
  title: "Retail Admin",
  description: "Retell AI",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    url: "/",
    title: "Retail Admin",
    description: "Retell AI",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Retell AI",
    description: "Retell AI"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="[&_*]:[scrollbar-width:thin] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-[11.4px] [&::-webkit-scrollbar]:h-[11.4px] [&::-webkit-scrollbar]:bg-[#424242] [&_*::-webkit-scrollbar]:w-[11.4px] [&_*::-webkit-scrollbar]:h-[11.4px] [&_*::-webkit-scrollbar]:bg-[#424242]  [&::-webkit-scrollbar-thumb]:bg-[#686868] [&::-webkit-scrollbar-thumb]:[outline:2px_solid_#424242] [&::-webkit-scrollbar-thumb]:outline-offset-[-2px] [&_*::-webkit-scrollbar-thumb]:bg-[#686868] [&_*::-webkit-scrollbar-thumb]:[outline:2px_solid_#424242] [&_*::-webkit-scrollbar-thumb]:outline-offset-[-2px]">
      <head>
        <link rel="icon" type="image/x-icon" href="/.ico" />  
        {/* need to uncomment  */}
      </head>
      <body className={`${GeistSans.className} [&_#nprogress_.bar]:bg-[#3B82F6!important] [&_#nprogress_.bar]:h-[4px!important]`}>
        <StoreProvider>
          <AuthProvider>
            <AuthWrapper>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {/* <RolePermissionProvider>  need to uncomment */}

              <NextTopLoader
                color="#3B82F6"
                initialPosition={0.035}
                crawlSpeed={200}
                height={3}
                crawl={true}
                showSpinner={false}
                easing="ease"
                speed={200}
                shadow="0 0 10px #3B82F6,0 0 5px #3B82F6"
                template='<div class="bar" role="bar"><div class="peg"></div></div> 
                          <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
                zIndex={1600}
                showAtBottom={false}
              />
              <Toaster />
              {children}
              {/* </RolePermissionProvider> */}
              </ThemeProvider>
            </AuthWrapper>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

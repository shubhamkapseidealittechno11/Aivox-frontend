"use client";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ModeToggle } from "@/components/demo/mode-toggle";
import { useTheme } from "next-themes";
import moment from 'moment';

export default function OnBoardLayout({
  children,
  ...props
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname()
  const { theme } = useTheme();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAppSelector((state: any) => state.auth)
  const currentYear = moment().format('YYYY');
  
  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.push('/dashboard')
      }
    }
  }, [isAuthenticated, isLoading, router])
  
  return (
    <div className="container relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20">
      <div className="justify-end flex items-center gap-3 fixed top-4 right-4 z-50">
        <ModeToggle />
      </div>
      <div className="lg:p-8 w-full animate-fade-in">

        {/* Modern Card Container matching login page */}
        <section className="lg:mt-6 mt-4 max-w-[480px] flex-col items-center gap-2 lg:p-8 p-6 mx-auto border-2 border-border rounded-2xl bg-card/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300">
          {children}
        </section>
        
        {/* Footer */}
        <div className="z-20 justify-center w-full lg:mt-auto sticky bottom-0 flex lg:hidden bg-background/80 backdrop-blur-sm border-t border-border mt-8">
          <blockquote className="space-y-2">
            <footer className="text-sm py-4">
              <div className="container flex flex-col items-center justify-center gap-4">
                <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
                  © {currentYear},Aivox
                </p>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
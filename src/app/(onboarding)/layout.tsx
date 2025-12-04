"use client";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
    <>
      <div className="container relative min-h-screen flex-col items-center justify-between flex lg:grid lg:max-w-none lg:grid-cols-2 lg:px-0" >
        <div className="flex flex-col justify-center items-center relative w-full h-full lg:dark:bg-[#161616] lg:bg-white text-white lg:border-r">
          {/* <div className="absolute inset-0 bg-zinc-900" /> */}

          {/* <div className="" />
          <Image
            className="m-auto object-contain size-[200px] absolute lg:block hidden "
            src="/logo.svg"
            alt="Logo"
            width={400}
            height={400}
          // priority
          />
          <div className="w-full h-screen lg:block hidden">
            <Image
              src="/login-img.png"
              alt="Logo"
              width={1920}
              height={1080}
              className="w-full h-full object-cover"
              priority
            />
          </div> */}

          <div className="absolute bottom-0 z-20 hidden lg:flex">
            <blockquote className="space-y-2">
              <footer className="text-sm">
                <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
                  <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
                    © {currentYear},Retell AI

                  </p>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>

        <div className="lg:p-8 w-full">
          <div className="justify-end flex items-center gap-2 absolute top-2 right-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-8 h-8 bg-background"
              asChild
            ></Button>
            <ModeToggle />
          </div>

          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">

           <section className="lg:mt-6 mt-4 max-w-[980px] flex-col items-center gap-2 lg:p-6 p-4  border border-input  rounded-md ">
              {/* <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
                Admin Panel
              </h1> */}
              <div className="flex justify-center lg:hidden block" >
                <Image
                 className="object-contain w-full text-center lg:size-[100px] size-[70px]"
                  src={"logo.svg"}
                  alt="Logo"
                  width={100}
                  height={100}
                  priority
                />
              </div>
              {children}
            </section>
          </div>
        </div>
        <div className="z-20 justify-center w-full lg:mt-auto sticky bottom-0 flex lg:hidden dark:bg-black bg-white">
          <blockquote className="space-y-2">
            <footer className="text-sm">
              <div className="container flex flex-col items-center justify-center gap-4 lg:h-24 md:flex-row">
                <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
                  © {currentYear}, Retell AI

                </p>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>


    </>
  )
}
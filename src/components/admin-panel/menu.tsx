'use client';

import Link from 'next/link';
import { Ellipsis, LogOut } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';

import { cn } from '@/lib/utils';
import { getMenuList } from '@/lib/menu-list';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CollapseMenuButton } from '@/components/admin-panel/collapse-menu-button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { useAppSelector } from '@/lib/hooks';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '@/context/AuthContext';

interface MenuProps {
  isOpen: boolean | undefined;
}

export function Menu({ isOpen }: MenuProps) {
  const { user }: any = useAppSelector((state: any) => state.auth);
  const pathname = usePathname();
  let [menuList, setMenuList]: any = useState(getMenuList(pathname));
  // const menuList = getMenuList(pathname);
  const { logout } = useAuth();
  const localPath = ["dashboard",]

  useEffect(() => {
    setMenuList(getMenuList(pathname))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])
  const checkPermission = (label: string, i: number, j: number) => {
    let isPermission = false;
    let checkValue = label;
    label == "Government officials" ? checkValue = "govt" : "";
    label == "Posts" ? checkValue = "post" : "";

    if (user?.rolePermission?.includes(`${checkValue?.toLocaleLowerCase()}_can_view`) || localPath?.includes(`${checkValue?.toLocaleLowerCase()}`)) {
      isPermission = true;
    }

    if (!isPermission) {
      const index = menuList?.[i]?.menus?.findIndex((el: any) => el.label == label);
      menuList?.[i]?.menus?.splice(index, 1);
      setMenuList(menuList)
    }
  }






  const logOutUser = async () => {
    await logout();
  }



  return (
    <ScrollArea className="[&>div>div[style]]:!block [&_.scrollbar]:end-[-4px!important] overscroll-none">
      <nav className="lg:mt-8 mt-2  h-full w-full">
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2">
          {menuList.map(({ groupLabel, menus }: any, index: number) => (
            (menus?.length ? <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="text-sm font-medium text-black-foreground px-4 pb-2 max-w-[248px] truncate dark:text-white">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2"></p>
              )}
              {menus.map(
                ({ href, label, icon: Icon, active, submenus }: any, j: number) => {
                  user?.userRole == 'subAdmin' && checkPermission(label, index, j);
                  return (user?.userRole && user?.userRole?.toLocaleLowerCase() == "subAdmin" && label == "Super Admin") ? '' :
                    (submenus.length === 0 ? (
                      <div className="w-full" key={j}>
                        <TooltipProvider disableHoverableContent>
                          <Tooltip delayDuration={100}>
                            <TooltipTrigger asChild>
                              <Button
                                variant={active ? "secondary" : "ghost"}
                                className="w-full justify-start h-10 mb-1 relative"
                                asChild
                              >
                                <Link href={href}>
                                  <span
                                    className={cn(isOpen === false ? "" : "mr-4")}
                                  >
                                    <Icon size={18} />
                                  </span>
                                  <p
                                    className={cn(
                                      "max-w-[200px] truncate ",
                                      isOpen === false
                                        ? "-translate-x-96 opacity-0"
                                        : "translate-x-0 opacity-100"
                                    )}
                                  >
                                    {label}
                                  </p>
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            {isOpen === false && (
                              <TooltipContent side="right">
                                {label}
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ) : (
                      <div className="w-full" key={j}>
                        <CollapseMenuButton
                          icon={Icon}
                          label={label}
                          active={active}
                          submenus={submenus}
                          isOpen={isOpen}
                        />
                      </div>
                    )
                    )
                }
              )}
            </li>
              : <></>)
          ))}
          <li className="w-full ">
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>

                  <Button
                    onClick={(e: any) => { logOutUser() }}
                    variant="outline"
                    className="group hover:bg-[#DCEDC0] flex justify-start w-full px-4 py-2 h-10 rounded-md border-0 text-white dark:text-white shadow-none"
                  >
                    <span className={cn(isOpen === false ? "" : "mr-3")}>
                      <LogOut
                        size={18}
                        className="!w-[18px] !h-[18px] text-black dark:text-white group-hover:text-[#397C65]"
                      />
                    </span>
                    <p
                      className={cn(
                        "whitespace-nowrap text-[#000000B2] dark:text-white group-hover:text-[#397C65]",
                        isOpen === false ? "opacity-0 hidden" : "opacity-100"
                      )}
                    >
                      Logout
                    </p>
                  </Button>

                </TooltipTrigger>
                {isOpen === false && (
                  <TooltipContent side="right">Logout</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </nav>
    </ScrollArea>
  );
}

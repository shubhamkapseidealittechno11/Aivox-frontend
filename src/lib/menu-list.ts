import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  Bug,
  FileText,
  ThumbsUp,
  Dock,
  Package,
  FileQuestion,
  FileSliders,
  NotepadText,
  CalendarDays,
  Vote,
  StickyNote,
  Flag,
  MessagesSquare,
  ShieldCheck,
  LandPlot,
  CircleHelp,
  MessageCircleHeart,
  Contact,
  LogOut,
  Shapes,
  BellDot,ActivityIcon,
  MapPinned,
  MapPin,
  BotMessageSquare
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Agents",
          active: pathname.includes("/dashboard"),
          icon: BotMessageSquare 
,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Managements",
      menus: [
        
        // {
        //   href: "/",
        //   label: "Places",
        //   active: pathname.includes("/"),
        //   icon: MapPin,
        //   submenus: []
        // },
        // {
        //   href: "/",
        //   label: "Activity",
        //   active: pathname.includes("/"),
        //   icon: ActivityIcon,
        //   submenus: []
        // },
   
      ],
    },

    {
      groupLabel: "Settings",
      menus: [
        // {
        //   href: "/notification",
        //   label: "Notification",
        //   active: pathname.includes("/notification"),
        //   icon: BellDot,
        //   submenus: []
        // },
        // {
        //   href: "/content/privacy_policy",
        //   label: "Content",
        //   active: pathname.includes("/content"),
        //   icon: NotepadText,
        //   submenus: [],
        // },
        // {
        //   href: "/contact-us",
        //   label: "Contact Us",
        //   active: pathname.includes("/contact-us"),
        //   icon: Contact,
        //   submenus: []
        // },
        {
          href: "/",
          label: "settings",
          active: pathname.includes("/g"),
          icon: Settings,
          submenus: [],
        },
      ],
    },
  ];
}

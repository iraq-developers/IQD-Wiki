import {
  Code,
  ShieldCheck,
  Globe,
  Trophy,
  LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export const sidebarNavItems: NavItem[] = [
  {
    title: "برمجة المواقع",
    href: "/web-development",
    icon: Globe,
  },
  {
    title: "أمن المعلومات",
    href: "/cyber-security",
    icon: ShieldCheck,
  },
  {
    title: "أساسيات البرمجة",
    href: "/fund-programming",
    icon: Code,
  },
  {
    title: "الهاكاثونات والفعاليات",
    href: "/hackathons",
    icon: Trophy,
  },
];

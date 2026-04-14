// src/components/dashboard/main-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

export function MainNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isJobSeeker = session?.user?.role === "JOBSEEKER";

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      visible: true,
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      visible: true,
    },
    {
      title: "Applications",
      href: "/dashboard/applications",
      visible: true,
    },
    {
      title: "My Jobs",
      href: "/dashboard/jobs",
      visible: !isJobSeeker,
    },
    {
      title: "Saved Jobs",
      href: "/dashboard/saved",
      visible: isJobSeeker,
    },
    {
      title: "Messages",
      href: "/dashboard/messages",
      visible: true,
    },
  ];

  return (
    <nav className="flex items-center space-x-6 lg:space-x-6">
      <Link
        href="/"
        className="hidden items-center space-x-2 md:flex"
      >
        <span className="hidden font-bold sm:inline-block">
          JobConnect
        </span>
      </Link>
      <div className="flex items-center space-x-4 lg:space-x-6">
        {navItems
          .filter((item) => item.visible)
          .map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.title}
            </Link>
          ))}
      </div>
    </nav>
  );
}
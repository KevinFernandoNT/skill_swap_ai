import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconHome,
  IconCalendar,
  IconUsers,
  IconArrowsExchange,
  IconMessageCircle,
  IconBulb,
  IconLogout
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/common/Logo";

interface SidebarDemoProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
  user?: any;
}

export default function SidebarDemo({ currentPage = 'dashboard', onNavigate, user }: SidebarDemoProps) {
  const links = [
    {
      label: "Dashboard",
      href: "#",
             icon: (
         <IconHome className="h-5 w-5 shrink-0 text-white" />
       ),
      path: "dashboard"
    },
    {
      label: "Sessions",
      href: "#",
             icon: (
         <IconCalendar className="h-5 w-5 shrink-0 text-white" />
       ),
      path: "sessions"
    },
    {
      label: "My Skills",
      href: "#",
             icon: (
         <IconBulb className="h-5 w-5 shrink-0 text-white" />
       ),
      path: "skills"
    },
    {
      label: "Connect",
      href: "#",
             icon: (
         <IconUsers className="h-5 w-5 shrink-0 text-white" />
       ),
      path: "connect"
    },
    {
      label: "Exchange Requests",
      href: "#",
      icon: (
        <IconArrowsExchange className="h-5 w-5 shrink-0 text-white" />
      ),
      path: "exchange-requests"
    },
    {
      label: "Exchange Sessions",
      href: "#",
      icon: (
        <IconArrowsExchange className="h-5 w-5 shrink-0 text-white" />
      ),
      path: "exchange-sessions"
    },
    {
      label: "Messages",
      href: "#",
             icon: (
         <IconMessageCircle className="h-5 w-5 shrink-0 text-white" />
       ),
      path: "messages"
    },
    {
      label: "Settings",
      href: "#",
             icon: (
         <IconSettings className="h-5 w-5 shrink-0 text-white" />
       ),
      path: "settings"
    },
  ];

  const [open, setOpen] = useState(false);

  const handleNavClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setOpen(false);
    }
  };

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden bg-gray-100 md:flex-row dark:bg-neutral-800",
        "h-screen", // Use full screen height
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10 bg-[#171717]">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                         <>
               <Logo className="text-white" />
             </>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <div key={idx} onClick={() => handleNavClick(link.path)}>
                  <SidebarLink 
                    link={{
                      ...link,
                      icon: currentPage === link.path 
                        ? React.cloneElement(link.icon as React.ReactElement, { className: "h-5 w-5 shrink-0 text-black" })
                        : link.icon
                    }} 
                    selected={currentPage === link.path}
                    className={cn(
                      "cursor-pointer transition-all duration-300 ease-in-out",
                      currentPage === link.path 
                        ? "bg-primary font-semibold text-black rounded-[5px] shadow-lg pl-[5px]" 
                        : "hover:bg-white/10 rounded-[5px] pl-[10px]"
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="pl-1 pb-3 space-y-3">
            <SidebarLink
              link={{
                label: (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                      {user?.name || "User"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {user?.email || "user@example.com"}
                    </span>
                  </div>
                ),
                href: "#",
                icon: (
                  <img
                    src={user?.avatar || "https://assets.aceternity.com/manu.png"}
                    className="h-10 w-10 rounded-full"
                    width={40}
                    height={40}
                    alt="Avatar"
                  />
                ),
              }}
            />
           
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}



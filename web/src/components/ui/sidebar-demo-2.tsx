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
  IconLogout,
  IconCalendarEvent,
  IconVideo,
  IconChevronDown,
  IconChevronRight,
  IconSchool,
  IconBook
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
  const [skillsExpanded, setSkillsExpanded] = useState(false);

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
    {
      label: "View Sessions",
      href: "#",
      icon: (
        <IconCalendarEvent className="h-5 w-5 shrink-0 text-white" />
      ),
      path: "view-sessions"
    },
    {
      label: "Video Call",
      href: "#",
      icon: (
        <IconVideo className="h-5 w-5 shrink-0 text-white" />
      ),
      path: "video-call"
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
              
              {/* Expandable My Skills Section */}
              <div className="flex flex-col">
                <div 
                  onClick={() => setSkillsExpanded(!skillsExpanded)}
                  className={cn(
                    "flex items-center justify-between cursor-pointer transition-all duration-300 ease-in-out rounded-[5px] pl-[10px] pr-3 py-2",
                    (currentPage === 'skills' || currentPage === 'skills-teaching' || currentPage === 'skills-learning')
                      ? "bg-primary font-semibold text-black shadow-lg pl-[5px]" 
                      : "hover:bg-white/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <IconBulb className="h-5 w-5 shrink-0 text-white" />
                    <span className="text-white">My Skills</span>
                  </div>
                  {skillsExpanded ? (
                    <IconChevronDown className="h-4 w-4 text-white" />
                  ) : (
                    <IconChevronRight className="h-4 w-4 text-white" />
                  )}
                </div>
                
                {skillsExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-6 mt-1 flex flex-col gap-1"
                  >
                    <div 
                      onClick={() => handleNavClick('skills-teaching')}
                      className={cn(
                        "flex items-center gap-3 cursor-pointer transition-all duration-300 ease-in-out rounded-[5px] pl-3 pr-3 py-2",
                        currentPage === 'skills-teaching'
                          ? "bg-primary font-semibold text-black shadow-lg" 
                          : "hover:bg-white/10"
                      )}
                    >
                      <IconSchool className="h-4 w-4 text-white" />
                      <span className="text-white text-sm">Skills I Can Teach</span>
                    </div>
                    <div 
                      onClick={() => handleNavClick('skills-learning')}
                      className={cn(
                        "flex items-center gap-3 cursor-pointer transition-all duration-300 ease-in-out rounded-[5px] pl-3 pr-3 py-2",
                        currentPage === 'skills-learning'
                          ? "bg-primary font-semibold text-black shadow-lg" 
                          : "hover:bg-white/10"
                      )}
                    >
                      <IconBook className="h-4 w-4 text-white" />
                      <span className="text-white text-sm">Skills I Want to Learn</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
          <div className="pl-1 pb-3 space-y-3">
            <div className="flex items-center gap-4">
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
                      src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80"}
                      className="h-10 w-10 rounded-full object-cover border-2 border-white/20 shadow-sm"
                      width={40}
                      height={40}
                      alt="Avatar"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80";
                      }}
                    />
                  ),
                }}
              />
              <button
                onClick={() => handleNavClick('settings')}
                className="p-2 text-gray-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/10"
                title="Profile Settings"
              >
                <IconSettings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}



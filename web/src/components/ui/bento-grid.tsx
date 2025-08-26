import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "motion/react";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-3 grid-rows-2 gap-6 w-full h-full",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  children,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 bg-card border border-border justify-between flex flex-col space-y-3 h-full",
        className
      )}
    >
      {header}
      {children ? (
        children
      ) : (
        <div className="group-hover/bento:translate-x-2 transition duration-200">
          {icon && (
            <div className="flex items-center gap-2 mb-2">
              {icon}
            </div>
          )}
          {title && (
            <div className="font-bold text-foreground mb-2 text-lg">{title}</div>
          )}
          {description && (
            <div className="font-normal text-muted-foreground text-sm">
              {description}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

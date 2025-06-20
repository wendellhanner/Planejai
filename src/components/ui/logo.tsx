"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "light" | "dark" | "auto";
  className?: string;
  showText?: boolean;
}

export function Logo({
  size = "md",
  variant = "auto",
  className,
  showText = true
}: LogoProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Evitar problemas de hidratação verificando se o componente está montado
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const sizes = {
    sm: "h-8",
    md: "h-10",
    lg: "h-14",
    xl: "h-20",
  };

  // Determine se deve usar o tema light ou dark
  const isLight = (() => {
    if (!mounted) return variant === "light";
    if (variant === "light") return true;
    if (variant === "dark") return false;
    if (variant === "auto" || variant === "default") return theme !== "dark";
    return theme !== "dark";
  })();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative">
        <div
          className={cn(
            sizes[size],
            "aspect-square rounded-xl",
            isLight
              ? "bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-500 shadow-lg text-white"
              : "bg-gradient-to-tr from-indigo-500 via-blue-600 to-blue-700 shadow-lg text-white",
            "flex items-center justify-center"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              size === "sm"
                ? "w-5 h-5"
                : size === "lg"
                ? "w-8 h-8"
                : size === "xl"
                ? "w-12 h-12"
                : "w-6 h-6"
            )}
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.29 7 12 12 20.71 7"></polyline>
            <line x1="12" y1="22" y2="12" x2="12"></line>
          </svg>
        </div>
        <div
          className={cn(
            "absolute -bottom-1 -right-1 rounded-full p-0.5 border-2 shadow-sm",
            isLight
              ? "bg-indigo-600 border-white"
              : "bg-blue-400 border-slate-800"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              size === "sm"
                ? "w-3 h-3"
                : size === "lg"
                ? "w-5 h-5"
                : size === "xl"
                ? "w-7 h-7"
                : "w-4 h-4"
            )}
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
      </div>
      {showText && (
        <div
          className={cn(
            size === "sm"
              ? "text-lg"
              : size === "lg"
              ? "text-2xl"
              : size === "xl"
              ? "text-4xl"
              : "text-xl",
            "font-bold",
            isLight ? "text-slate-900 dark:text-white" : "text-white dark:text-white"
          )}
        >
          <span>Planej</span>
          <span className={isLight ? "text-indigo-600 dark:text-indigo-400" : "text-blue-300"}>
            .AI
          </span>
        </div>
      )}
    </div>
  );
}

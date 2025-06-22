"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  homeElement?: React.ReactNode;
  separator?: React.ReactNode;
  containerClasses?: string;
  listClasses?: string;
  activeItemClasses?: string;
  inactiveItemClasses?: string;
}

export function Breadcrumb({
  homeElement = <Home className="h-4 w-4" />,
  separator = <ChevronRight className="h-4 w-4" />,
  containerClasses = "flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400",
  listClasses = "flex items-center space-x-2",
  activeItemClasses = "font-medium text-slate-900 dark:text-white",
  inactiveItemClasses = "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
}: BreadcrumbProps) {
  const paths = usePathname();
  const pathNames = paths?.split("/").filter((path) => path);

  return (
    <nav aria-label="Breadcrumb" className={containerClasses}>
      <ol className={listClasses}>
        <li>
          <Link href="/" className={inactiveItemClasses}>
            {homeElement}
          </Link>
        </li>
        {pathNames?.length > 0 && separator}
        
        {pathNames?.map((link, index) => {
          const href = `/${pathNames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathNames.length - 1;
          const formattedLink = link
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
            
          return (
            <li key={index} className="flex items-center">
              <Link
                href={href}
                className={isLast ? activeItemClasses : inactiveItemClasses}
                aria-current={isLast ? "page" : undefined}
              >
                {formattedLink}
              </Link>
              {!isLast && separator && <span className="ml-2">{separator}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

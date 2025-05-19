import { ReactNode } from "react";
import Sidebar from "./sidebar";
import { useMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const isMobile = useMobile();

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-800">
      <Sidebar />
      
      <div className={`${!isMobile ? 'ml-64' : ''} flex-1`}>
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}

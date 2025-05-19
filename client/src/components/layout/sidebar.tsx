import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Globe, X, Menu, BarChart3, Cog, Shield, Rocket, Terminal, Book } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMobile();
  const [location] = useLocation();

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location, isMobile]);

  // Automatically open sidebar on desktop
  useEffect(() => {
    if (!isMobile) {
      setIsOpen(true);
    }
  }, [isMobile]);

  const navigationItems = [
    { title: "DevOps Dashboard", path: "/", icon: <BarChart3 className="mr-4 h-5 w-5 text-primary-300" /> },
    { title: "Infrastructure", path: "/infrastructure", icon: <Cog className="mr-4 h-5 w-5 text-gray-400" /> },
    { title: "CI/CD Pipelines", path: "/pipelines", icon: <Rocket className="mr-4 h-5 w-5 text-gray-400" /> },
    { title: "Security", path: "/security", icon: <Shield className="mr-4 h-5 w-5 text-gray-400" /> },
    { title: "Monitoring", path: "/monitoring", icon: <BarChart3 className="mr-4 h-5 w-5 text-gray-400" /> },
    { title: "Local Setup", path: "/local-setup", icon: <Terminal className="mr-4 h-5 w-5 text-gray-400" /> },
    { title: "Documentation", path: "/documentation", icon: <Book className="mr-4 h-5 w-5 text-gray-400" /> },
  ];

  return (
    <>
      {/* Mobile Header */}
      {isMobile && (
        <div className="bg-white shadow-sm lg:hidden">
          <div className="py-2 px-4 flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(true)}
              className="text-gray-600 hover:text-gray-900 mr-4"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-medium">TerraFusionPro</h1>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div 
        className={`
          bg-gray-900 text-white w-64 pt-5 pb-3 flex flex-col fixed h-screen z-10
          transition-all duration-300 ease-in-out
          ${isMobile && !isOpen ? '-translate-x-full' : ''}
        `}
      >
        <div className="flex items-center px-4 pb-4 border-b border-gray-800">
          <Globe className="h-6 w-6 text-secondary-500 mr-2" />
          <h1 className="text-xl font-bold text-white">TerraFusionPro</h1>
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              className="ml-auto text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <nav className="mt-5 px-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium rounded-md
                  ${location === item.path 
                    ? 'text-white bg-primary-600 focus:outline-none' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none'}
                `}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="px-4 pt-4 border-t border-gray-800">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-xs text-white">DA</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">DevOps Admin</p>
              <p className="text-xs font-medium text-gray-400">admin@terrafusion.com</p>
            </div>
            <button className="ml-auto text-gray-400 hover:text-white">
              <Cog className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

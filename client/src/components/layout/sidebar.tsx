import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Building, 
  FileText, 
  BarChart2, 
  Users, 
  Camera, 
  HelpCircle, 
  X, 
  Menu, 
  Settings,
  TrendingUp,
  Map
} from "lucide-react";

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
    { title: "Dashboard", path: "/", icon: <Home className="mr-4 h-5 w-5 text-primary-300" /> },
    { title: "Properties", path: "/properties", icon: <Building className="mr-4 h-5 w-5 text-gray-400" /> },
    { title: "Appraisals", path: "/appraisals", icon: <FileText className="mr-4 h-5 w-5 text-gray-400" /> },
    { title: "Market Analysis", path: "/market-analysis", icon: <TrendingUp className="mr-4 h-5 w-5 text-gray-400" /> },
    { title: "Analytics", path: "/analytics", icon: <BarChart2 className="mr-4 h-5 w-5 text-gray-400" /> },
    { title: "Users", path: "/users", icon: <Users className="mr-4 h-5 w-5 text-gray-400" /> },
    { title: "Field Data", path: "/field-data", icon: <Camera className="mr-4 h-5 w-5 text-gray-400" /> },
    { title: "Help Center", path: "/help", icon: <HelpCircle className="mr-4 h-5 w-5 text-gray-400" /> },
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
            <h1 className="text-lg font-medium">TerraFusionProfessional</h1>
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
          <Building className="h-6 w-6 text-secondary-500 mr-2" />
          <h1 className="text-xl font-bold text-white">TerraFusion<span className="text-secondary-400">Pro</span></h1>
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
              <span className="text-xs text-white">RA</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Real Estate Appraiser</p>
              <p className="text-xs font-medium text-gray-400">appraiser@terrafusion.com</p>
            </div>
            <button className="ml-auto text-gray-400 hover:text-white">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

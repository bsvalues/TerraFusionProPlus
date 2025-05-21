import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  Bell, 
  Search, 
  User,
  Settings, 
  LogOut, 
  HelpCircle,
  X 
} from 'lucide-react';

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b bg-background z-50">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left side - Logo and menu toggle */}
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 mr-2 rounded-md hover:bg-accent lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <Link to="/" className="flex items-center">
            <span className="text-primary font-semibold text-xl mr-1">Terra</span>
            <span className="text-xl font-bold">Fusion</span>
            <span className="text-xs bg-primary text-white px-1 py-0.5 rounded ml-1">PRO</span>
          </Link>
        </div>
        
        {/* Center - Search */}
        <div className={`fixed inset-0 bg-background/80 backdrop-blur-sm transition-all ${searchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'} lg:static lg:bg-transparent lg:backdrop-blur-none lg:opacity-100 lg:pointer-events-auto`}>
          <div className="relative max-w-lg mx-auto mt-16 px-4 lg:mt-0 lg:mx-0 lg:px-0">
            {searchOpen && (
              <button
                onClick={() => setSearchOpen(false)}
                className="absolute right-6 top-1 p-2 lg:hidden"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search properties, appraisals..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>
        
        {/* Right side - Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-md hover:bg-accent lg:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setUserMenuOpen(false);
              }}
              className="p-2 rounded-md hover:bg-accent relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
            </button>
            
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-card rounded-md shadow-lg border overflow-hidden z-50">
                <div className="p-4 border-b">
                  <h3 className="font-medium">Notifications</h3>
                </div>
                <div className="p-2 max-h-[280px] overflow-y-auto">
                  <div className="p-3 hover:bg-accent rounded-md transition-colors border-l-2 border-primary">
                    <p className="text-sm font-medium">New appraisal request</p>
                    <p className="text-xs text-muted-foreground mt-1">123 Main St, Austin, TX 78701</p>
                    <p className="text-xs text-muted-foreground mt-1">10 minutes ago</p>
                  </div>
                  <div className="p-3 hover:bg-accent rounded-md transition-colors border-l-2 border-muted">
                    <p className="text-sm font-medium">Appraisal report completed</p>
                    <p className="text-xs text-muted-foreground mt-1">456 Oak Drive, Austin, TX 78704</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                  <div className="p-3 hover:bg-accent rounded-md transition-colors border-l-2 border-muted">
                    <p className="text-sm font-medium">Market data update available</p>
                    <p className="text-xs text-muted-foreground mt-1">New Q2 2025 data for Austin area</p>
                    <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                  </div>
                </div>
                <div className="p-2 border-t text-center">
                  <Link to="/notifications" className="text-xs text-primary hover:underline">
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative">
            <button
              onClick={() => {
                setUserMenuOpen(!userMenuOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
              aria-label="User menu"
            >
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium">Jane Appraiser</p>
                <p className="text-xs text-muted-foreground">Premium</p>
              </div>
            </button>
            
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-card rounded-md shadow-lg border overflow-hidden z-50">
                <div className="p-2">
                  <button className="w-full flex items-center gap-2 p-2 text-sm rounded-md hover:bg-accent transition-colors text-left">
                    <User className="h-4 w-4" />
                    Profile
                  </button>
                  <button className="w-full flex items-center gap-2 p-2 text-sm rounded-md hover:bg-accent transition-colors text-left">
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button className="w-full flex items-center gap-2 p-2 text-sm rounded-md hover:bg-accent transition-colors text-left">
                    <HelpCircle className="h-4 w-4" />
                    Help & Support
                  </button>
                  <hr className="my-1" />
                  <button className="w-full flex items-center gap-2 p-2 text-sm rounded-md hover:bg-accent transition-colors text-destructive text-left">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
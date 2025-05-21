import { Link } from 'react-router-dom';
import { Home, User, LogOut } from 'lucide-react';

// In a real app, we would use authentication context
// This is a simplified version
const Navbar = () => {
  const isLoggedIn = true; // For demo purposes
  const user = { name: 'John Appraiser', role: 'appraiser' }; // Mock user for UI display

  const handleLogout = () => {
    console.log('User logged out');
    // Would clear auth state and redirect to login
  };

  return (
    <div className="border-b bg-card">
      <div className="flex h-16 items-center px-4 container mx-auto max-w-7xl">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl text-primary">TerraFusionPro</span>
          </Link>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded capitalize">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium hover:text-primary"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
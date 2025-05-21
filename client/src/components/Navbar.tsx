import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">TerraFusionProfessional</Link>
        <div className="space-x-2">
          <span className="text-sm">Jane Appraiser</span>
          <img 
            src="https://ui-avatars.com/api/?name=Jane+Appraiser&background=0D8ABC&color=fff" 
            alt="User profile" 
            className="w-8 h-8 rounded-full inline-block ml-2"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
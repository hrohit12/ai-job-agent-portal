import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="w-full bg-transparent overflow-hidden">
      <div className="flex justify-between items-center px-4 md:px-6 py-4 max-w-7xl mx-auto h-16 md:h-20">
        <div className="flex items-center">
          <div
            onClick={() => window.location.href = "/"}
            className="relative flex items-center group h-10 w-40 md:w-96 cursor-pointer"
          >
            <img
              src="/src/assets/nareshit-logo.png"
              alt="Naresh IT Logo"
              className="h-20 md:h-44 w-auto absolute left-0 top-[-30px] md:top-[-75px] group-hover:scale-105 transition-transform duration-300 max-w-none"
            />
          </div>
        </div>
        <div className="flex items-center">
          <Link to="/admin" className="px-3 md:px-5 py-2 md:py-2.5 bg-secondary text-white hover:bg-secondary-dark text-[11px] md:text-[14px] font-semibold transition-all rounded-lg uppercase tracking-wider shadow-lg shadow-secondary/15 active:scale-95 leading-tight">
            Post Job
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';



export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/"); 
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-black shadow z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Left: Logo */}
          <div className="text-2xl font-bold text-white">
            <Link to={"/"}><h2 className='text-3xl font-bold'>Edify</h2></Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6">
            {/* {!isLoggedIn && <Link to="/">Home</Link>} */}
            {!isLoggedIn && <a href="#about">About</a>}
            {!isLoggedIn && <a href="#contact">Contact</a>}
            {!isLoggedIn && <Link to="/signup">Sign Up</Link>}

            {!isLoggedIn ? (
              <Link to="/login">Log In</Link>
            ) : (
              <button
                onClick={handleLogout}
                className="text-white hover:text-red-400"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-500 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
                   viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                <path d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-2 space-y-2 pb-4">
            {/* <a href="#" className="block px-2 py-1 text-gray-700 hover:text-blue-500">Home</a> */}
            {!isLoggedIn && <a href="#about" className="block px-2 py-1 text-gray-700 hover:text-blue-500">About</a>}
            {!isLoggedIn && <a href="#contact" className="block px-2 py-1 text-gray-700 hover:text-blue-500">Contact</a>}
            {!isLoggedIn && <Link to="/signup" className="block px-2 py-1 text-gray-700 hover:text-blue-500">Sign Up</Link>}
            {!isLoggedIn ? (
              <Link to="/login">Log In</Link>
            ) : (
              <button
                onClick={handleLogout}
                className="text-white hover:text-red-400"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
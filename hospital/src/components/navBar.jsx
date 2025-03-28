import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Typography } from "@material-tailwind/react";

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location

  const handleOpen = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Function to check if the link is active
  const isActiveLink = (path) => location.pathname === path;

  return (
    <nav className="bg-gray-200 fixed top-0 left-0 w-full z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Brand Name */}
        <Typography variant="h5" className="text-blue-600 font-bold text-4xl">
          MediSync
        </Typography>

        {/* Hamburger Icon for Mobile */}
        <div className="flex md:hidden">
          <button onClick={() => setOpen((prev) => !prev)} className="text-black focus:outline-none">
            {/* Hamburger Icon */}
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <div className={`hidden md:flex items-center space-x-12 ${open ? 'flex' : 'hidden'}`}>
          {/* Dropdown for Home */}
          <div className="relative">
            <button
              className="text-black focus:outline-none flex items-center"
              onClick={handleOpen}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              Home
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <Link to="/dashboard/home" className={`block px-4 py-2 text-black hover:bg-gray-100 ${isActiveLink('/dashboard/home') ? 'border-b-2 border-blue-500' : ''}`}>
                  Home
                </Link>
                <Link to="/dashboard/home/patient-history" className={`block px-4 py-2 text-black hover:bg-gray-100 ${isActiveLink('/dashboard/patient-history') ? 'border-b-2 border-blue-500' : ''}`}>
                  Patient History
                </Link>
                <Link to="/dashboard/home/make-appointments" className={`block px-4 py-2 text-black hover:bg-gray-100 ${isActiveLink('/dashboard/make-appointments') ? 'border-b-2 border-blue-500' : ''}`}>
                  Make Appointments
                </Link>
                <Link to="/dashboard/home/my-appointments" className={`block px-4 py-2 text-black hover:bg-gray-100 ${isActiveLink('/dashboard/my-appointments') ? 'border-b-2 border-blue-500' : ''}`}>
                  My Appointments
                </Link>
              </div>
            )}
          </div>

          {/* Profile Link */}
          <Link to="/dashboard/home/patient-profile" className={`text-black flex items-center ${isActiveLink('/dashboard/home/patient-profile') ? 'border-b-2 border-blue-500' : ''}`}>
            Profile
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-black text-white px-4 py-2 rounded-md transition hover:bg-gray-700"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="flex flex-col items-center md:hidden bg-gray-200 p-4">
          <Link to="/dashboard/home" className={`block w-full text-left px-4 py-2 text-black hover:bg-gray-100 ${isActiveLink('/dashboard/home') ? 'border-b-2 border-blue-500' : ''}`}>
            Make Appointments
          </Link>
          <Link to="/dashboard/home/patient-history" className={`block w-full text-left px-4 py-2 text-black hover:bg-gray-100 ${isActiveLink('/dashboard/patient-history') ? 'border-b-2 border-blue-500' : ''}`}>
            Patient History
          </Link>
          <Link to="/dashboard/home/my-appointments" className={`block w-full text-left px-4 py-2 text-black hover:bg-gray-100 ${isActiveLink('/dashboard/my-appointments') ? 'border-b-2 border-blue-500' : ''}`}>
            My Appointments
          </Link>
          <Link to="/dashboard/home/patient-profile" className={`block w-full text-left px-4 py-2 text-black hover:bg-gray-100 ${isActiveLink('/dashboard/home/patient-profile') ? 'border-b-2 border-blue-500' : ''}`}>
            Profile
          </Link>
          <button
            onClick={handleLogout}
            className="bg-black text-white w-full text-left px-4 py-2 rounded-md transition hover:bg-gray-700"
          >
            Log Out
          </button>
        </div>
      )}
    </nav>
  );
}

import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Correct imports for routing
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
} from "@material-tailwind/react"; // Ensure material-tailwind is installed
import {
  HomeIcon,
  UserCircleIcon,
  PowerIcon,
  CalendarIcon,
  ClipboardDocumentIcon,
  ClockIcon,
} from "@heroicons/react/24/solid"; // Ensure heroicons package is installed

export function Navbar() {  // Ensure the function name is 'Navbar'
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <AppBar position="static" className="bg-gray-200 shadow-md">
      <Toolbar className="flex justify-between items-center">
        <Typography variant="h5" className="text-blue-600 font-bold">
          MediSync
        </Typography>
        <div className="flex space-x-4">
          <Link to="/dashboard/home">
            <Button variant="text" color="gray">
              <HomeIcon className="h-5 w-5 mr-1" />
              Home
            </Button>
          </Link>
          <Link to="">
            <Button variant="text" color="gray">
              <CalendarIcon className="h-5 w-5 mr-1" />
              Make Appointments
            </Button>
          </Link>
          <Link to="">
            <Button variant="text" color="gray">
              <ClipboardDocumentIcon className="h-5 w-5 mr-1" />
              Patient History
            </Button>
          </Link>
          <Link to="">
            <Button variant="text" color="gray">
              <ClockIcon className="h-5 w-5 mr-1" />
              My Appointments
            </Button>
          </Link>
          <Link to="">
            <Button variant="text" color="gray">
              <UserCircleIcon className="h-5 w-5 mr-1" />
              Profile
            </Button>
          </Link>
          <Button variant="text" color="gray" onClick={handleLogout}>
            <PowerIcon className="h-5 w-5 mr-1" />
            Log Out
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}

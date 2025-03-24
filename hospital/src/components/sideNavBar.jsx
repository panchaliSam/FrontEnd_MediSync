import React from "react";
import { NavLink, useNavigate } from 'react-router-dom'; 
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import {
  HomeIcon, 
  UserCircleIcon,
  PowerIcon,
  CalendarIcon,           // Icon for Make Appointments
  ClipboardDocumentIcon,   // Icon for Patient History
  UserIcon,                // Icon for Doctors
  ChartBarIcon,            // Icon for Statistics
} from "@heroicons/react/24/solid";

export function MultiLevelSidebar() {
  const navigate = useNavigate(); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="h-screen flex">
      <Card className="h-full w-full max-w-[20rem] p-4 bg-gray-200 text-white shadow-xl shadow-blue-gray-900/5 rounded-none">
        <div className="mb-2 p-4">
          <Typography variant="h5" className="text-center text-blue-600 font-bold mb-4 text-4xl"> 
            MediSync
          </Typography>
        </div>
        <List>
          {/* Home Link */}
          <NavLink to="/dashboard/home" className={({ isActive }) => `block ${isActive ? 'bg-blue-500 text-white' : 'text-black'}`}>
            <ListItem>
              <ListItemPrefix>
                <HomeIcon className="h-5 w-5" /> {/* Home icon */}
              </ListItemPrefix>
              <Typography className="font-normal">Home</Typography>
            </ListItem>
          </NavLink>

          {/* Appointments Link */}
          <NavLink to="/dashboard/home/appointments" className={({ isActive }) => `block ${isActive ? 'bg-blue-500 text-white' : 'text-black'}`}>
            <ListItem>
              <ListItemPrefix>
                <CalendarIcon className="h-5 w-5" /> {/* Icon for Make Appointments */}
              </ListItemPrefix>
              <Typography className="font-normal">Appointments</Typography>
            </ListItem>
          </NavLink>

          {/* Patient History Link */}
          <NavLink to="/dashboard/home/patient-history" className={({ isActive }) => `block ${isActive ? 'bg-blue-500 text-white' : 'text-black'}`}>
            <ListItem>
              <ListItemPrefix>
                <ClipboardDocumentIcon className="h-5 w-5" /> {/* Icon for Patient History */}
              </ListItemPrefix>
              <Typography className="font-normal">Patient History</Typography>
            </ListItem>
          </NavLink>

          {/* Doctors Link */}
          <NavLink to="/dashboard/home/doctors" className={({ isActive }) => `block ${isActive ? 'bg-blue-500 text-white' : 'text-black'}`}>
            <ListItem>
              <ListItemPrefix>
                <UserIcon className="h-5 w-5" /> {/* Icon for Doctors */}
              </ListItemPrefix>
              <Typography className="font-normal">Doctors</Typography>
            </ListItem>
          </NavLink>

          {/* Statistics Link */}
          <NavLink to="/dashboard/home/statistics" className={({ isActive }) => `block ${isActive ? 'bg-blue-500 text-white' : 'text-black'}`}>
            <ListItem>
              <ListItemPrefix>
                <ChartBarIcon className="h-5 w-5" /> {/* Icon for Statistics */}
              </ListItemPrefix>
              <Typography className="font-normal">Statistics</Typography>
            </ListItem>
          </NavLink>

          {/* Profile Link */}
          <NavLink to="/dashboard/home/profile" className={({ isActive }) => `block ${isActive ? 'bg-blue-500 text-white' : 'text-black'}`}>
            <ListItem>
              <ListItemPrefix>
                <UserCircleIcon className="h-5 w-5" />
              </ListItemPrefix>
              <Typography className="font-normal">Profile</Typography>
            </ListItem>
          </NavLink>

          {/* Log Out Button */}
          <ListItem button onClick={handleLogout}>
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>
            <Typography className="font-normal">Log Out</Typography>
          </ListItem>
        </List>
      </Card>
    </div>
  );
}

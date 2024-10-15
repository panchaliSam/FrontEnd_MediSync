import React from "react";
import { Link, useNavigate } from 'react-router-dom'; 
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  HomeIcon, 
  UserCircleIcon,
  PowerIcon,
  CalendarIcon,           // Icon for Make Appointments
  ClipboardDocumentIcon,   // Icon for Patient History
  ClockIcon,               // Icon for My Appointments
  ChevronRightIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/solid";

export function MultiLevelSidebar() {
  const [open, setOpen] = React.useState(0);
  const navigate = useNavigate(); 

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="h-screen flex">
      {/* Added rounded-none to remove border radius */}
      <Card className="h-full w-full max-w-[20rem] p-4 bg-gray-200 text-white shadow-xl shadow-blue-gray-900/5 rounded-none">
        <div className="mb-2 p-4">
          <Typography variant="h5" className="text-center text-blue-600 font-bold mb-4 text-4xl"> 
            MediSync
          </Typography>
        </div>
        <List>
          <Accordion
            open={open === 1}
            icon={
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
              />
            }
          >
            <ListItem className="p-0" selected={open === 1}>
              <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
                <ListItemPrefix>
                  <HomeIcon className="h-5 w-5" /> {/* Home icon */}
                </ListItemPrefix>
                <Typography color="black" className="mr-auto font-normal"> {/* Changed color to white */}
                  Home
                </Typography>
              </AccordionHeader>
            </ListItem>
            <AccordionBody className="py-1">
              <List className="p-0">
                <Link to="/dashboard/home" className="block">
                  <ListItem>
                    <ListItemPrefix>
                      <CalendarIcon className="h-5 w-5" /> {/* Icon for Make Appointments */}
                    </ListItemPrefix>
                    <Typography color="black">Make Appointments</Typography> {/* Changed color to white */}
                  </ListItem>
                </Link>
                <Link to="/dashboard/customer-segmentation" className="block">
                  <ListItem>
                    <ListItemPrefix>
                      <ClipboardDocumentIcon className="h-5 w-5" /> {/* Icon for Patient History */}
                    </ListItemPrefix>
                    <Typography color="black">Patient History</Typography> {/* Changed color to white */}
                  </ListItem>
                </Link>
                <Link to="/dashboard/customer-demand-analysis" className="block">
                  <ListItem>
                    <ListItemPrefix>
                      <ClockIcon className="h-5 w-5" /> {/* Icon for My Appointments */}
                    </ListItemPrefix>
                    <Typography color="black">My Appointments</Typography> {/* Changed color to white */}
                  </ListItem>
                </Link>
              </List>
            </AccordionBody>
          </Accordion>
          <ListItem>
            <ListItemPrefix>
              <UserCircleIcon className="h-5 w-5" />
            </ListItemPrefix>
            <Typography color="black">Profile</Typography> {/* Changed color to white */}
          </ListItem>
          <ListItem button onClick={handleLogout}>
            <ListItemPrefix>
              <PowerIcon className="h-5 w-5" />
            </ListItemPrefix>
            <Typography color="black">Log Out</Typography> {/* Changed color to white */}
          </ListItem>
        </List>
      </Card>
    </div>
  );
}

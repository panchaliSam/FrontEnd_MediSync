import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import {
  CalendarIcon,          // Icon for Make Appointments
  ClipboardDocumentIcon,  // Icon for Patient History
  ClockIcon,              // Icon for My Appointments
} from "@heroicons/react/24/solid";

// Named export for PatientHome
export function PatientHome() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 p-4">
      {/* Headings */}
      <Typography variant="h3" className="text-blue-600 font-bold mb-0 text-4xl md:text-5xl">
        MediSync
      </Typography>
      <Typography variant="h3" className="text-black font-bold mb-0 text-2xl md:text-3xl">
        Welcome
      </Typography>
      <Typography variant="h4" className="text-gray-700 mb-4 text-center text-lg md:text-xl">
        Online Health Care Management System
      </Typography>

      {/* Card Section */}
      <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        {/* Card for Make Appointments */}
        <Link to="/dashboard/make-appointments" className="w-full max-w-xs">
          <Card className="h-60 bg-blue-500 text-white hover:bg-blue-600 cursor-pointer">
            <CardBody className="flex flex-col items-center justify-center h-full p-6">
              <CalendarIcon className="h-12 w-12 mb-2" />
              <Typography variant="h5" className="font-bold text-center">
                Make Appointments
              </Typography>
            </CardBody>
          </Card>
        </Link>

        {/* Card for Patient History */}
        <Link to="/dashboard/patient-history" className="w-full max-w-xs">
          <Card className="h-60 bg-blue-500 text-white hover:bg-blue-600 cursor-pointer">
            <CardBody className="flex flex-col items-center justify-center h-full p-6">
              <ClipboardDocumentIcon className="h-12 w-12 mb-2" />
              <Typography variant="h5" className="font-bold text-center">
                Patient History
              </Typography>
            </CardBody>
          </Card>
        </Link>

        {/* Card for My Appointments */}
        <Link to="/dashboard/my-appointemnets" className="w-full max-w-xs">
          <Card className="h-60 bg-blue-500 text-white hover:bg-blue-600 cursor-pointer">
            <CardBody className="flex flex-col items-center justify-center h-full p-6">
              <ClockIcon className="h-12 w-12 mb-2" />
              <Typography variant="h5" className="font-bold text-center">
                My Appointments
              </Typography>
            </CardBody>
          </Card>
        </Link>
      </div>
    </div>
  );
}

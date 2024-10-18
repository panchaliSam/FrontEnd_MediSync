import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { CalendarIcon } from "@heroicons/react/24/solid";
import TimeSlotSelection from './timeSlotSelection'; // Import the new component

const MakeAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [doctorAvailability, setDoctorAvailability] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState(null); // State to hold the selected availability
  const [showTimeSlots, setShowTimeSlots] = useState(false); // State to control the time slots display
  const [availableDate, setAvailableDate] = useState(''); // New state for available date


  // Fetch doctors when the component mounts
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:8080/CSSE_MediSync/doctors');
        const sortedDoctors = response.data.sort((a, b) => a.doctor_name.localeCompare(b.doctor_name));
        setDoctors(sortedDoctors); // Sorting doctors by name
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
    fetchDoctors();
  }, []);

  // Fetch availability data after selecting a doctor
  const fetchDoctorAvailability = async (doctorName) => {
    try {
      const response = await axios.get(`http://localhost:8080/CSSE_MediSync/doctor-availability?doctorName=${encodeURIComponent(doctorName)}`);
      const availabilityWithDefaultStatus = response.data.map(item => ({
        ...item,
        isAvailable: true // Set to true by default
      }));
      setDoctorAvailability(availabilityWithDefaultStatus); // Set the availability data
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  // Filter doctors based on the search term entered
  const filteredDoctors = doctors.filter(doctor =>
    doctor.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle doctor selection
  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor.doctor_name);
    setSearchTerm(doctor.doctor_name);
    setShowDropdown(false);  // Close the dropdown after selection
    fetchDoctorAvailability(doctor.doctor_name);  // Fetch the availability details
  };

  // Function to handle the appointment button click
  const handleAppointmentClick = (availability) => {
    setSelectedAvailability(availability);
    setAvailableDate(availability.availableDate); // Set the available date from the selected availability
    setShowTimeSlots(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 space-y-4">
      <Typography variant="h4" className="text-blue-600 font-bold mb-4 text-3xl">
        Make an Appointment
      </Typography>

      {/* Conditionally render main content based on showTimeSlots state */}
      {!showTimeSlots ? (
        <>
          <Card className="w-full max-w-md bg-blue-100">
            <CardBody className="p-6">
              <div className="flex items-center mb-4">
                <CalendarIcon className="h-12 w-12 mr-2 text-black" />
                <Typography variant="h5" className="font-bold text-black">
                  Select a Doctor
                </Typography>
              </div>
              <div className="relative">
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search for a doctor..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowDropdown(true); // Show dropdown while typing
                  }}
                  className="w-full p-2 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Show dropdown if there are matching doctors */}
                {showDropdown && searchTerm && filteredDoctors.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded max-h-60 overflow-y-auto">
                    {filteredDoctors.map((doctor) => (
                      <li
                        key={doctor.doctor_id}
                        className="p-2 hover:bg-blue-300 cursor-pointer"
                        onClick={() => handleDoctorSelect(doctor)}
                      >
                        <span className="font-bold text-black">{doctor.doctor_name}</span>{' '}
                        <br />
                        <span className="text-gray-800 text-sm">{doctor.specialization}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Show no results message if applicable */}
                {showDropdown && searchTerm && filteredDoctors.length === 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-300 rounded p-2">
                    No results found.
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Display availability cards */}
          <div className="grid grid-cols-1 gap-4 mt-6 w-full max-w-md">
            {doctorAvailability.length > 0 ? doctorAvailability.map((availability, index) => (
              <Card key={index} className="bg-white border border-black relative">
                <CardBody className="pb-16"> {/* Added padding-bottom to avoid overlapping with the button */}
                  <Typography variant="h6" className="font-bold text-black">
                    {availability.hospitalName}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Available Date: {availability.availableDate}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600">
                    Time: {availability.startTime} - {availability.endTime}
                  </Typography>
                  <Typography variant="body2" className={`font-bold ${availability.isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                    {availability.isAvailable ? 'Available' : 'Not Available'}
                  </Typography>
                  
                  {/* Make Appointment Button */}
                  <button
                    className="absolute bottom-4 right-4 bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700"
                    onClick={() => handleAppointmentClick(availability)} // Open time slot selection
                  >
                    Make Appointment
                  </button>
                </CardBody>
              </Card>
            )) : (
              <Typography variant="body1" className="text-gray-600">No availability found.</Typography>
            )}
          </div>
        </>
      ) : (
        // Show Time Slot Selection if activated
        <TimeSlotSelection
          doctorDetails={{
            hospitalName: selectedAvailability?.hospitalName,
            doctorName: selectedDoctor,
            specialization: doctors.find(doc => doc.doctor_name === selectedDoctor)?.specialization || 'Unknown',
          }}
          availability={{
            startTime: selectedAvailability?.startTime,
            endTime: selectedAvailability?.endTime,
          }}
          availableDate={availableDate} // Pass the available date here
          onClose={() => {
            setShowTimeSlots(false);
            setSelectedAvailability(null); // Reset selected availability when closing
          }} // Close the time slot selection
        />
      )}
    </div>
  );
};

export default MakeAppointment;

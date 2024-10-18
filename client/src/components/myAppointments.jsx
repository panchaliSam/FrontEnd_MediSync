import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardBody, Typography } from "@material-tailwind/react";

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId'); // Get the user ID from local storage

  // Fetch the patient name using user ID
  const fetchPatientName = async (userId) => {
    try {
      const response = await axios.get('http://localhost:8080/CSSE_MediSync/patients');
      const data = response.data;
      console.log('Fetched patients:', data); // Log fetched patients

      // Find the patient that matches the user ID
      const patient = data.find(patient => patient.user_id === parseInt(userId));
      if (patient) {
        setPatientName(patient.patient_name);
        console.log('Patient found:', patient.patient_name); // Log found patient name
      } else {
        setPatientName('');
        console.warn('Patient not found for user ID:', userId);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatientName('');
    }
  };

  // Fetch the appointments
  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/CSSE_MediSync/appointments');
      const data = response.data;
      console.log('Fetched appointments:', data); // Log fetched appointments

      // Filter appointments related to the patient name
      const filteredAppointments = data.filter(appointment => appointment.patientName === patientName);
      console.log('Filtered appointments:', filteredAppointments); // Log filtered appointments
      setAppointments(filteredAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchPatientName(userId); // Fetch patient name using user ID
    } else {
      console.warn('No user ID found in local storage.');
      setLoading(false); // Set loading to false if no user ID
    }
  }, [userId]);

  useEffect(() => {
    if (patientName) {
      fetchAppointments(); // Fetch appointments after patient name is set
    }
  }, [patientName]);

  // Display loading state or appointments
  if (loading) {
    return <div>Loading appointments...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 space-y-4">
      <Typography variant="h4" className="text-blue-600 font-bold mb-4 text-3xl">
        My Appointments
      </Typography>

      {appointments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 w-full max-w-md">
          {appointments.map((appointment) => (
            <Card key={appointment.appointmentId} className="bg-blue-100 border">
              <CardBody>
                <Typography variant="h6" className="font-bold text-black italic">
                  {appointment.doctorName}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {appointment.specialization}
                </Typography><hr className="border-blue-500 border-2" /><br></br>
                <Typography variant="body2" className="text-black font-bold italic">
                  {appointment.hospitalName}
                </Typography><br></br>
                <Typography variant="body2" className="text-gray-600">
                  Date: {appointment.appointmentDate}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  Time: {appointment.appointmentTime}
                </Typography>
                {/* <Typography variant="body2" className="font-bold">
                  Payment Amount: SLR {appointment.paymentAmount.toFixed(2)}
                </Typography> */}
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Typography variant="body1" className="text-gray-600">No appointments found.</Typography>
      )}
    </div>
  );
};

export default MyAppointments;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardBody, Typography } from '@material-tailwind/react';

const HospitalDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [hospital, setHospital] = useState(null);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');  // Assuming userId is stored in localStorage

  useEffect(() => {
    const fetchHospitalDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8080/CSSE_MediSync/hospitals');
        const hospitals = response.data;

        const loggedInHospital = hospitals.find(hospital => hospital.user_id === parseInt(userId));
        if (loggedInHospital) {
          setHospital(loggedInHospital);
        } else {
          setError('Hospital not found for this user.');
        }
      } catch (err) {
        setError('Error fetching hospital details. Please try again later.');
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:8080/CSSE_MediSync/doctors');
        const allDoctors = response.data;

        if (hospital) {
          const hospitalDoctors = allDoctors.filter(doctor => doctor.hospital_name === hospital.hospital_name);
          setDoctors(hospitalDoctors);
        }
      } catch (err) {
        setError('Error fetching doctor details. Please try again later.');
      }
    };

    if (hospital) {
      fetchDoctors();
    } else {
      fetchHospitalDetails();
    }
  }, [userId, hospital]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Typography variant="h5" color="red">{error}</Typography>
      </div>
    );
  }

  if (!hospital || doctors.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Typography variant="h5">Loading doctors...</Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4">
      <Typography variant="h4" className="text-blue-600 font-bold mb-4 text-3xl">
        Doctors at {hospital.hospital_name}
      </Typography>

      <Card className="bg-white border shadow-md w-full max-w-6xl">
        <CardBody>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-100">
                <tr>
                  {['Doctor ID', 'Doctor Name', 'Specialization', 'Contact No', 'Charge (LKR)'].map((header) => (
                    <th key={header} className="px-4 py-3 text-left text-xs text-black font-bold uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {doctors.map((doctor) => (
                  <tr key={doctor.doctor_id}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.doctor_id}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.doctor_name}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.specialization}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.contact_no}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{doctor.doctor_charge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default HospitalDoctors;

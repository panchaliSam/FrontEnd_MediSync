import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardBody, Typography } from '@material-tailwind/react';

const PatientHistory = () => {
  const [patientRecords, setPatientRecords] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId'); // Get the user ID from local storage

  // Fetch the patient name using user ID
  const fetchPatientName = async (userId) => {
    try {
      const response = await axios.get('http://localhost:8080/CSSE_MediSync/patients');
      const data = response.data;

      // Find the patient that matches the user ID
      const patient = data.find((patient) => patient.user_id === parseInt(userId));
      if (patient) {
        setPatientName(patient.patient_name);
      } else {
        console.warn('Patient not found for user ID:', userId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch the patient records
  const fetchPatientRecords = async () => {
    try {
      const response = await axios.get('http://localhost:8080/CSSE_MediSync/patientRecords');
      const records = response.data;

      // Filter records related to the patient name
      const filteredRecords = records.filter((record) => record.patient_name === patientName);
      setPatientRecords(filteredRecords);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchPatientName(userId); // Fetch patient name using user ID
    }
  }, [userId]);

  useEffect(() => {
    if (patientName) {
      fetchPatientRecords(); // Fetch records after patient name is set
    }
  }, [patientName]);

  // Display loading state or records
  if (loading) {
    return <div>Loading patient history...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 space-y-4">
      <Typography variant="h4" className="text-blue-600 font-bold mb-4 text-3xl">
        Patient History
      </Typography>

      {patientRecords.length > 0 ? (
        <Card className="bg-white border shadow-md w-full max-w-6xl"> {/* Increased max width here */}
          <CardBody>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-100">
                  <tr>
                    {['Record ID', 'Patient Name', 'Hospital Name', 'Doctor Name', 'Appointment ID', 'Diagnosis', 'Medicines', 'Lab Test Report'].map((header) => (
                      <th key={header} className="px-4 py-3 text-left text-xs text-black font-bold uppercase tracking-wider"> {/* Increased padding here */}
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {patientRecords.map((record) => (
                    <tr key={record.record_id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{record.record_id}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{record.patient_name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{record.hospital_name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{record.doctor_name}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{record.appointment_id}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{record.diagnosis}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{record.medicines}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <a href={record.lab_test_report_link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                          View Report
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Typography variant="body1" className="text-gray-600">No patient records found.</Typography>
      )}
    </div>
  );
};

export default PatientHistory;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardBody, Typography } from '@material-tailwind/react';
import { PencilIcon, PlusCircleIcon, EyeIcon } from '@heroicons/react/24/solid';

const PatientHistory = () => {
  const [patientRecords, setPatientRecords] = useState([]);
  const [hospitalName, setHospitalName] = useState('');
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setViewIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const userId = localStorage.getItem('userId');

  const fetchHospitalName = async (userId) => {
    try {
      const response = await axios.get('http://localhost:8080/CSSE_MediSync/hospitals');
      const data = response.data;
      const hospital = data.find((hospital) => hospital.user_id === parseInt(userId));
      if (hospital) {
        setHospitalName(hospital.hospital_name);
        fetchAppointments(hospital.hospital_name);
        console.log(hospital.hospital_name);
      } else {
        console.warn('Hospital not found for user ID:', userId);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPatientRecords = async () => {
    try {
      const response = await axios.get('http://localhost:8080/CSSE_MediSync/patientRecords');
      const records = response.data;
      const filteredRecords = records.filter((record) => record.hospital_name === hospitalName);
      setPatientRecords(filteredRecords);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axios.get('http://localhost:8080/CSSE_MediSync/patients');
      setPatients(response.data);
      console.log('Fetched patients:', response.data); // Add this line to check the output
    } catch (error) {
      console.error(error);
    }
  };  

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('http://localhost:8080/CSSE_MediSync/doctors');
      setDoctors(response.data); // Change patients to doctors
      console.log('Fetched doctors:', response.data); // Debugging log
    } catch (error) {
      console.error(error);
    }
  };  

  const fetchAppointments = async (hospitalName) => {
    try {
      const response = await axios.get('http://localhost:8080/CSSE_MediSync/appointments');
      console.log('Full response data:', response.data); // Log the full response data
  
      // Filter appointments based on the hospital name
      const filteredAppointments = response.data.filter(
        (appointment) => appointment.hospital_name === "Kings"
      );
  
      // Set the filtered appointments to state
      setAppointments(filteredAppointments);
  
      console.log('Fetched appointments for', hospitalName, ':', filteredAppointments); // Debugging log
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };
  
  useEffect(() => {
    if (userId) {
      fetchHospitalName(userId);
      fetchPatients();
      fetchDoctors();
      fetchAppointments();
    }
  }, [userId]);

  useEffect(() => {
    if (hospitalName) {
      fetchPatientRecords();
    }
  }, [hospitalName]);

  const handleViewAppointmentClick = (record) => {
    setSelectedRecord(record);
    setViewIsModalOpen(true);
  };

  const handleEditClick = (record) => {
    setSelectedRecord(record);
    setIsEditModalOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedRecord(null); // Reset for new record
    setIsModalOpen(true);
  };

  const handleEditFormSubmit = async (event) => {
    event.preventDefault();
    const updatedData = {
      patient_name: event.target.patientName.value,
      hospital_name: hospitalName,
      doctor_name: event.target.doctorName.value,
      appointment_id: event.target.appointmentId.value,
      diagnosis: event.target.diagnosis.value,
      medicines: event.target.medicines.value,
      lab_test_report_link: event.target.labTestReport.value,
    };

    try {
      await axios.put(`http://localhost:8080/CSSE_MediSync/patientRecords?record_id=${selectedRecord.record_id}`, updatedData);
      setPatientRecords((prevRecords) =>
        prevRecords.map((record) => (record.record_id === selectedRecord.record_id ? { ...record, ...updatedData } : record))
      );
    } catch (error) {
      console.error('Error updating patient record:', error);
    } finally {
      setIsEditModalOpen(false);
    }
  };

  const handleCreateFormSubmit = async (event) => {
    event.preventDefault();
    const newRecord = {
      patient_name: event.target.patientName.value,
      hospital_name: hospitalName,
      doctor_name: event.target.doctorName.value,
      appointment_id: event.target.appointmentId.value,
      diagnosis: event.target.diagnosis.value,
      medicines: event.target.medicines.value,
      lab_test_report_link: event.target.labTestReport.value,
    };

    try {
      const response = await axios.post('http://localhost:8080/CSSE_MediSync/patientRecords?action=create', newRecord);
      setPatientRecords((prevRecords) => [...prevRecords, response.data]);
    } catch (error) {
      console.error('Error creating patient record:', error);
    } finally {
      setIsModalOpen(false);
    }
  };

  if (loading) {
    return <div>Loading patient history...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 space-y-4">
      <Typography variant="h4" className="text-blue-600 font-bold mb-4 text-3xl">
        Patient History
      </Typography>

      <div className="flex justify-between w-full max-w-6xl mb-4">
        {/* View Appointment button on the left */}
        <button onClick={handleViewAppointmentClick} className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          <EyeIcon className="w-5 h-5 mr-1" /> View Appointments
        </button>

        {/* Create New Record button on the right */}
        <button onClick={handleCreateClick} className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          <PlusCircleIcon className="w-5 h-5 mr-1" /> Create New Record
        </button>
      </div>

      {patientRecords.length > 0 ? (
        <Card className="bg-white border shadow-md w-full max-w-6xl">
          <CardBody>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-100">
                  <tr>
                    {['Record ID', 'Patient Name', 'Hospital Name', 'Doctor Name', 'Appointment ID', 'Diagnosis', 'Medicines', 'Lab Test Report', 'Action'].map((header) => (
                      <th key={header} className="px-4 py-3 text-left text-xs text-black font-bold uppercase tracking-wider">
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
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button onClick={() => handleEditClick(record)} className="text-blue-500 hover:text-blue-700">
                          <PencilIcon className="w-5 h-5 inline-block" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Typography variant="body1" className="text-gray-600">No patient records found for this hospital.</Typography>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div id="crud-modal" className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Patient Record</h3>
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center">
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l12 12M1 13L13 1" />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <form onSubmit={handleEditFormSubmit} className="space-y-4 p-4">
                <div>
                  <label htmlFor="patientName" className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-300">Patient Name</label>
                  <select name="patientName" id="patientName" className="block w-full border border-gray-300 rounded-lg p-2">
                    {patients.map((patient) => (
                      <option key={patient.patient_id} value={patient.patient_name} selected={patient.patient_name === selectedRecord.patient_name}>
                        {patient.patient_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="doctorName" className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-300">Doctor Name</label>
                  <select name="doctorName" id="doctorName" defaultValue={selectedRecord.doctor_name} required className="block w-full border border-gray-300 rounded-lg p-2">
                    {doctors.map((doctor) => (
                      <option key={doctor.doctor_id} value={doctor.doctor_name}>
                        {doctor.doctor_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="appointmentId" className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-300">Appointment ID</label>
                  <input
                    type="text"
                    name="appointmentId"
                    id="appointmentId"
                    defaultValue={selectedRecord.appointment_id}
                    required
                    className="block w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label htmlFor="diagnosis" className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-300">Diagnosis</label>
                  <textarea
                    name="diagnosis"
                    id="diagnosis"
                    defaultValue={selectedRecord.diagnosis}
                    required
                    className="block w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label htmlFor="medicines" className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-300">Medicines</label>
                  <textarea
                    name="medicines"
                    id="medicines"
                    defaultValue={selectedRecord.medicines}
                    required
                    className="block w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label htmlFor="labTestReport" className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-300">Lab Test Report Link</label>
                  <input
                    type="url"
                    name="labTestReport"
                    id="labTestReport"
                    defaultValue={selectedRecord.lab_test_report_link}
                    required
                    className="block w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
                <button type="submit" className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">Update Record</button>
              </form>
            </div>
          </div>
        </div>
      )}

     {/* Modal */}
    {isViewModalOpen && (
      <div id="crud-modal" className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="relative p-4 w-full max-w-6xl">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Appointment Records</h3>
              <button
                type="button"
                onClick={() => setViewIsModalOpen(false)}
                className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1l12 12M1 13L13 1"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            {/* Appointment Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="py-2 px-4 text-left text-xs font-bold uppercase text-black">Doctor</th>
                    <th className="py-2 px-4 text-left text-xs font-bold uppercase text-black">Specialization</th>
                    <th className="py-2 px-4 text-left text-xs font-bold uppercase text-black">Date</th>
                    <th className="py-2 px-4 text-left text-xs font-bold uppercase text-black">Time</th>
                    <th className="py-2 px-4 text-left text-xs font-bold uppercase text-black">Patient</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment.appointmentId} className="hover:bg-gray-100">
                      <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-500">{appointment.doctorName}</td>
                      <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-500">{appointment.specialization}</td>
                      <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-500">{appointment.appointmentDate}</td>
                      <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-500">{appointment.appointmentTime}</td>
                      <td className="py-2 px-4 whitespace-nowrap text-sm text-gray-500">{appointment.patientName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    )}

      {/* Create Modal */}
      {isModalOpen && (
        <div id="crud-modal" className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create Patient Record</h3>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex items-center justify-center">
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l12 12M1 13L13 1" />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <form onSubmit={handleCreateFormSubmit} className="space-y-4 p-4">
                <div>
                  <label htmlFor="patientName" className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-300">Patient Name</label>
                  <select name="patientName" id="patientName" className="block w-full border border-gray-300 rounded-lg p-2">
                    {patients.map((patient) => (
                      <option key={patient.patient_id} value={patient.patient_name}>
                        {patient.patient_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="doctorName" className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-300">Doctor Name</label>
                  <select name="doctorName" id="doctorName" required className="block w-full border border-gray-300 rounded-lg p-2">
                    {doctors.map((doctor) => (
                      <option key={doctor.doctor_id} value={doctor.doctor_name}>
                        {doctor.doctor_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="appointmentId" className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-300">Appointment ID</label>
                  <input
                    type="text"
                    name="appointmentId"
                    id="appointmentId"
                    required
                    className="block w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label htmlFor="diagnosis" className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-300">Diagnosis</label>
                  <textarea
                    name="diagnosis"
                    id="diagnosis"
                    required
                    className="block w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label htmlFor="medicines" className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-300">Medicines</label>
                  <textarea
                    name="medicines"
                    id="medicines"
                    required
                    className="block w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label htmlFor="labTestReport" className="block mb-1 text-sm font-medium text-gray-900 dark:text-gray-300">Lab Test Report Link</label>
                  <input
                    type="url"
                    name="labTestReport"
                    id="labTestReport"
                    required
                    className="block w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
                <button type="submit" className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700">Create Record</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientHistory;

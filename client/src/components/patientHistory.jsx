import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardBody, Typography, Button } from '@material-tailwind/react';
import QRCode from 'react-qr-code'; 
import { jsPDF } from 'jspdf';  

const PatientHistory = () => {
  const [patientRecords, setPatientRecords] = useState([]);
  const [patientName, setPatientName] = useState('');
  const [loading, setLoading] = useState(true);
  const [qrModalOpen, setQrModalOpen] = useState(false); 
  const [selectedRecord, setSelectedRecord] = useState(null); 
  const userId = localStorage.getItem('userId'); 

  const fetchPatientName = async (userId) => {
    try {
      const response = await axios.get('http://localhost:8080/CSSE_MediSync/patients');
      const data = response.data;

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

  const fetchPatientRecords = async () => {
    try {
      const response = await axios.get('http://localhost:8080/CSSE_MediSync/patientRecords');
      const records = response.data;

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
      fetchPatientName(userId); 
    }
  }, [userId]);

  useEffect(() => {
    if (patientName) {
      fetchPatientRecords(); 
    }
  }, [patientName]);

  if (loading) {
    return <div>Loading patient history...</div>;
  }

  const generatePDF = (record) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Patient History Record", 20, 20);
    doc.setFontSize(12);
    doc.text(`Record ID: ${record.record_id}`, 20, 30);
    doc.text(`Patient Name: ${record.patient_name}`, 20, 40);
    doc.text(`Hospital Name: ${record.hospital_name}`, 20, 50);
    doc.text(`Doctor Name: ${record.doctor_name}`, 20, 60);
    doc.text(`Appointment ID: ${record.appointment_id}`, 20, 70);
    doc.text(`Diagnosis: ${record.diagnosis}`, 20, 80);
    doc.text(`Medicines: ${record.medicines}`, 20, 90);
    doc.text(`Lab Test Report: ${record.lab_test_report_link}`, 20, 100);
    doc.save(`patient_record_${record.record_id}.pdf`);
  };

  const handleQrScan = async (qrValue) => {
    try {
      // Parse the QR code value as JSON
      const recordData = JSON.parse(qrValue); 
      const recordId = recordData.record_id;

      // Find the full record based on the record ID
      const record = patientRecords.find((rec) => rec.record_id === recordId);

      if (record) {
        generatePDF(record);  // Generate the PDF with all the details
      } else {
        console.error('Record not found for the scanned QR code.');
      }

      setQrModalOpen(false);  // Close the modal after scanning
    } catch (error) {
      console.error('Error scanning QR code:', error);
    }
  };

  const openQrModal = (record) => {
    setSelectedRecord(record);
    setQrModalOpen(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 space-y-4">
      <Typography variant="h4" className="text-blue-600 font-bold mb-4 text-3xl">
        Patient History
      </Typography>

      {patientRecords.length > 0 ? (
        <Card className="bg-white border shadow-md w-full max-w-6xl">
          <CardBody>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-100">
                  <tr>
                    {['Record ID', 'Patient Name', 'Hospital Name', 'Doctor Name', 'Appointment ID', 'Diagnosis', 'Medicines', 'Lab Test Report', 'Scan QR'].map((header) => (
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
                        <button
                          onClick={() => openQrModal(record)} 
                          className="text-blue-500 underline"
                        >
                          Scan QR
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
        <Typography variant="body1" className="text-gray-600">No patient records found.</Typography>
      )}

      {/* QR Code Modal */}
      {selectedRecord && (
        <div id="timeline-modal" className={`fixed inset-0 flex items-center justify-center z-50 ${qrModalOpen ? '' : 'hidden'}`}>
          <div className="relative p-4 w-full max-w-xs"> {/* Decreased the modal width */}
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Scan this QR Code</h3>
                <button
                  type="button"
                  className="text-gray-400 hover:bg-gray-200 rounded-lg h-8 w-8 flex justify-center items-center"
                  onClick={() => setQrModalOpen(false)}
                >
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                </button>
              </div>
              <div className="p-4">
              <QRCode
                value={`
                  Record ID: ${selectedRecord.record_id}
                  Patient Name: ${selectedRecord.patient_name}
                  Hospital Name: ${selectedRecord.hospital_name}
                  Doctor Name: ${selectedRecord.doctor_name}
                  Appointment ID: ${selectedRecord.appointment_id}
                  Diagnosis: ${selectedRecord.diagnosis}
                  Medicines: ${selectedRecord.medicines}
                  Lab Test Report: ${selectedRecord.lab_test_report_link}
                `}
                size={256}
              />            
                <div className="flex justify-center mt-4">
                  <Button
                    onClick={() => handleQrScan(JSON.stringify({
                      record_id: selectedRecord.record_id,
                      patient_name: selectedRecord.patient_name,
                      hospital_name: selectedRecord.hospital_name,
                      doctor_name: selectedRecord.doctor_name,
                      appointment_id: selectedRecord.appointment_id,
                      diagnosis: selectedRecord.diagnosis,
                      medicines: selectedRecord.medicines,
                      lab_test_report_link: selectedRecord.lab_test_report_link,
                    }))}
                    color="blue"
                  >
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientHistory;

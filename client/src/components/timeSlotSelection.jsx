import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

const TimeSlotSelection = ({ doctorDetails, availability, availableDate, patientName, onClose }) => {
  const { hospitalName, doctorName, specialization } = doctorDetails;

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedCardNumber, setSelectedCardNumber] = useState(null);
  const [doctorCharge, setDoctorCharge] = useState(0);
  const [hospitalCharge, setHospitalCharge] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [bookedSlots, setBookedSlots] = useState(new Set());
  const [existingAppointments, setExistingAppointments] = useState([]); // To store existing appointments


  // Generate time slots based on availability
  const generateTimeSlots = () => {
    const start = new Date(`1970-01-01T${availability.startTime}`);
    const end = new Date(`1970-01-01T${availability.endTime}`);
    const slots = [];

    while (start < end) {
      slots.push(new Date(start));
      start.setMinutes(start.getMinutes() + 10); // Increment by 10 minutes
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Handle slot click to open modal
  const handleSlotClick = (slot, index) => {
    if (!bookedSlots.has(slot.toISOString())) { // Check if the slot is booked
      setSelectedSlot(slot);
      setSelectedCardNumber(index + 1);
      console.log("Date:", availableDate || "No date provided");
      setModalOpen(true);
    }
  };

  const fetchExistingAppointments = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in local storage');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8080/CSSE_MediSync/appointments`);
      const appointments = await response.json();
  
      // Filter appointments for the current patient and the selected date
      const patientAppointments = appointments.filter(appointment => 
        appointment.patientId === Number(userId) && appointment.appointmentDate === availableDate
      );
  
      setExistingAppointments(patientAppointments);
    } catch (error) {
      console.error('Error fetching existing appointments:', error);
    }
  };
  

  // Fetch doctor charge
  const fetchDoctorCharge = async () => {
    try {
      const response = await fetch(`http://localhost:8080/CSSE_MediSync/doctors`);
      const doctors = await response.json();
      const doctor = doctors.find(doc => doc.doctor_name === doctorName);
      if (doctor) {
        setDoctorCharge(doctor.doctor_charge);
      }
    } catch (error) {
      console.error('Error fetching doctor charge:', error);
    }
  };

  // Fetch patient data by user_id from local storage
  const fetchPatientData = async () => {
    const userId = localStorage.getItem('userId'); // Get userId from local storage
    if (!userId) {
      console.error('User ID not found in local storage');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/CSSE_MediSync/patients`);
      const patients = await response.json(); // Assume this returns an array of patients
      const patient = patients.find(p => p.user_id === Number(userId)); // Find patient by user_id
      if (patient) {
        setPatientData(patient.patient_name);
      } else {
        console.log('Patient not found for user_id:', userId);
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
    }
  };


  // Fetch hospital charge
  const fetchHospitalCharge = async () => {
    try {
      const response = await fetch(`http://localhost:8080/CSSE_MediSync/hospitals`);
      const hospitals = await response.json();
      const hospital = hospitals.find(hosp => hosp.hospital_name === hospitalName);
      if (hospital) {
        setHospitalCharge(hospital.hospital_charge);
      }
    } catch (error) {
      console.error('Error fetching hospital charge:', error);
    }
  };

  const handleConfirmAppointment = async () => {
    // Fetch existing appointments again to ensure we have the latest data
    await fetchExistingAppointments();
  
    // Check for existing appointments for the patient on the same date
    const hasExistingAppointment = existingAppointments.some(appointment => 
      appointment.appointmentDate === availableDate && 
      appointment.patientName === patientData
    );
  
    if (hasExistingAppointment) {
      alert('You already have an appointment scheduled for this day. Please choose another date or time.');
      return;
    }
  
    try {
      // Create payment record
      const paymentResponse = await fetch('http://localhost:8080/CSSE_MediSync/payments?action=create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          payment_date: new Date().toISOString().split('T')[0],
          payment_method: paymentMethod,
        }),
        credentials: 'include',
      });
  
      if (!paymentResponse.ok) {
        throw new Error('Failed to create payment');
      }
  
      const paymentsResponse = await fetch('http://localhost:8080/CSSE_MediSync/payments');
      const paymentsData = await paymentsResponse.json();
      const latestPayment = paymentsData[paymentsData.length - 1];
      const paymentId = latestPayment.payment_id;
  
      const appointmentResponse = await fetch('http://localhost:8080/CSSE_MediSync/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hospitalName,
          doctorName,
          appointmentDate: availableDate,
          appointmentTime: selectedSlot.toTimeString().split(' ')[0],
          patientName: patientData,
          paymentId, // Use the payment ID from the created payment
        }),
      });
  
      if (!appointmentResponse.ok) {
        throw new Error('Failed to create appointment');
      }
  
      setBookedSlots((prev) => new Set(prev).add(selectedSlot.toISOString()));

       // Generate the report after successful appointment
      generateReport({
        doctorName,
        hospitalName,
        appointmentDate: availableDate,
        appointmentTime: selectedSlot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        patientName: patientData,
        paymentId,
        doctorCharge,
        hospitalCharge,
        totalAmount,
        paymentMethod,
      });

      alert(`Appointment confirmed for ${patientData} on ${availableDate} at ${selectedSlot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} with payment ID: ${paymentId}`);
      setModalOpen(false);
    } catch (error) {
      console.error('Error confirming appointment:', error);
      alert('Oops! It seems you\'re trying to schedule an appointment with the same hospital on this date. Please choose a different date or hospital for your appointment.');
    }
  };


  const generateReport = (data) => {
    const doc = new jsPDF();
  
    doc.setFontSize(16);
    doc.text('Appointment Confirmation Report', 20, 20);
    doc.setFontSize(12);
    doc.text('========================', 20, 30);
    
    doc.text(`Doctor: ${data.doctorName}`, 20, 40);
    doc.text(`Hospital: ${data.hospitalName}`, 20, 50);
    doc.text(`Appointment Date: ${data.appointmentDate}`, 20, 60);
    doc.text(`Appointment Time: ${data.appointmentTime}`, 20, 70);
    doc.text(`Patient Name: ${data.patientName}`, 20, 80);
    doc.text(`Payment ID: ${data.paymentId}`, 20, 90);
    doc.text(`Doctor Charge: SLR: ${data.doctorCharge.toFixed(2)}`, 20, 100);
    doc.text(`Hospital Charge: SLR: ${data.hospitalCharge.toFixed(2)}`, 20, 110);
    doc.text(`Total Amount: SLR: ${data.totalAmount.toFixed(2)}`, 20, 120);
    doc.text(`Payment Method: ${data.paymentMethod}`, 20, 130);
  
    // Save the PDF
    doc.save('appointment_report.pdf');
  };

  // Calculate total amount when charges change
  useEffect(() => {
    const total = doctorCharge + hospitalCharge;
    setTotalAmount(total);
  }, [doctorCharge, hospitalCharge]);

  // Open modal to fetch charges
  useEffect(() => {
    if (modalOpen) {
      fetchDoctorCharge();
      fetchHospitalCharge();
      fetchPatientData(); 
      fetchExistingAppointments();
    }
  }, [modalOpen]);

  return (
    <div className="flex flex-col items-center justify-center p-4 max-w-screen-sm mx-auto mt-16">
         <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <div className="mb-4 text-center p-4 bg-blue-50 rounded-lg shadow-md">
        <h3 className="font-semibold text-xl text-blue-700 mb-2">{doctorName}</h3>
        <p className="text-lg text-gray-600 mb-1">
          <span className="font-bold">{specialization}</span>
        </p>
        <hr />
        <p className="text-lg text-gray-600">
          Hospital: <span className="font-bold">{hospitalName}</span>
        </p>
      </div>

      {/* Time Slot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl">
        {timeSlots.length > 0 ? (
          timeSlots.map((slot, index) => (
            <div key={index} className="bg-green-100 p-4 rounded-lg shadow-md text-center">
              <div className="flex justify-center items-center w-10 h-10 bg-black text-white rounded-full mx-auto mb-2">
                {index + 1}
              </div>
              <h4 className="text-lg">
                {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </h4>
              <button
                className={`mt-2 py-1 px-4 rounded w-full ${bookedSlots.has(slot.toISOString()) ? 'bg-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-green-700'}`}
                onClick={() => handleSlotClick(slot, index)}
                disabled={bookedSlots.has(slot.toISOString())} // Disable button if slot is booked
              >
                {bookedSlots.has(slot.toISOString()) ? 'Booked' : 'Available'}
              </button>
            </div>
          ))
        ) : (
          <p>No available time slots.</p>
        )}
      </div>
      <button
        className="mt-4 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 w-full"
        onClick={onClose}
      >
        Cancel
      </button>

{/* Modal for confirming appointment */}
{modalOpen && (
  <div
    id="default-modal"
    className="fixed top-0 right-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
    onClick={() => setModalOpen(false)}
  >
    <div
      className="relative p-4 w-full max-w-2xl max-h-full"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative bg-white rounded-lg shadow">
        {/* Modal header */}
        <div className="flex items-center justify-between p-4 border-b rounded-t">
          <h3 className="text-xl font-semibold text-gray-900">Confirm Appointment</h3>
          <button
            type="button"
            className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 inline-flex justify-center items-center"
            onClick={() => setModalOpen(false)}
          >
            &times;
          </button>
        </div>

        {/* Modal body with scrollable content */}
        <div className="p-4 space-y-4 max-h-96 overflow-y-auto"> {/* Add max-h-96 and overflow-y-auto */}
          <h1>
            <span className="font-semibold text-gray-600 text-2xl italic">Channeling Details</span>
          </h1>
          <hr className="border-t-2 border-blue-500 w-4/5 mx-auto ml-1" />
          <p className="flex justify-between">
            <span className="font-semibold italic">Doctor</span> <span>{doctorName}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-semibold italic">Specialization</span> <span>{specialization}</span>
          </p>
          <p className="flex justify-between">
            <span className="font-semibold italic">Hospital</span> <span>{hospitalName}</span>
          </p>

          {/* Patient Details */}
          <div className="p-4 space-y-4">
            <h1>
              <span className="font-semibold text-gray-600 text-2xl italic">Patient Details</span>
            </h1>
            <hr className="border-t-2 border-blue-500 w-4/5 mx-auto ml-1" />
            <p className="flex justify-between">
              <span className="font-semibold italic">Patient Name</span> <span>{patientData}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-semibold italic">Time Slot</span> <span>{selectedSlot?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-semibold italic">Patient Number</span> <span>{selectedCardNumber}</span>
            </p>
          </div>

          {/* Payment Section */}
          <div className="p-4 space-y-4">
            <h1>
              <span className="font-semibold text-gray-600 text-2xl italic">Payment Details</span>
            </h1>
            <hr className="border-t-2 border-blue-500 w-4/5 mx-auto ml-1" />
            <p className="flex justify-between">
              <span className="font-semibold italic">Doctor Charge</span> <span>SLR: {doctorCharge.toFixed(2)}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-semibold italic">Hospital Charge</span> <span>SLR: {hospitalCharge.toFixed(2)}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-semibold italic">Total Amount</span> <span>SLR: {totalAmount.toFixed(2)}</span>
            </p>
            <label className="block mb-2">
              <span className="font-semibold italic">Payment Method</span>
              <select 
                className="block w-full p-2 border rounded" 
                value={paymentMethod} 
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="">Select a payment method</option>
                <option value="creditCard">Credit Card</option>
                <option value="debitCard">Debit Card</option>
                <option value="cash">Cash</option>
              </select>
            </label>
          </div>
        </div>

        {/* Modal footer */}
        <div className="flex items-center justify-between p-4 border-t">
        <button
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 w-full"
            onClick={handleConfirmAppointment}
          >
            Confirm Appointment
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default TimeSlotSelection;

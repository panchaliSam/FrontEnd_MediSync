import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function Statistics() {
  const [appointments, setAppointments] = useState([]);
  const [hospitalName, setHospitalName] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  // Fetch hospital data based on userId
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios
        .get(`http://localhost:8080/CSSE_MediSync/hospitals`)
        .then((response) => {
          const hospitalData = response.data.find(hospital => hospital.user_id === parseInt(userId));
          if (hospitalData) {
            setHospitalName(hospitalData.hospital_name);
          }
        })
        .catch((error) => {
          console.error("Error fetching hospital data", error);
        });
    }
  }, []);

  // Fetch all appointments data
  useEffect(() => {
    axios
      .get("http://localhost:8080/CSSE_MediSync/appointments")
      .then((response) => {
        setAppointments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching appointments data", error);
      });
  }, []);

  // Filter appointments by hospital and selected date
  useEffect(() => {
    if (hospitalName) {
      const filtered = appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.appointmentDate);
        return (
          appointment.hospitalName === hospitalName &&
          appointmentDate.toDateString() === selectedDate.toDateString()
        );
      });
      setFilteredAppointments(filtered);
    }
  }, [appointments, hospitalName, selectedDate]);

  // Prepare data for the line chart
  const chartData = {
    labels: filteredAppointments.map(app => app.appointmentTime),
    datasets: [
      {
        label: "Peak Times",
        data: filteredAppointments.map(() => 1), // Since each appointment counts as 1
        fill: false,
        borderColor: "#4A90E2",
        backgroundColor: "#4A90E2",
      },
    ],
  };

  return (
    <div className="statistics-container">
      {/* <h1 className="text-2xl font-bold mb-4">Hospital: {hospitalName}</h1> */}
      
      {/* Date Picker */}
      <div className="mb-4">
        <label className="text-lg">Select Date:</label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          className="ml-2 border p-2 rounded"
        />
      </div>

      {/* Line Chart */}
      <div className="chart-container">
        {filteredAppointments.length > 0 ? (
          <Line data={chartData} />
        ) : (
          <p>No appointments available for the selected date.</p>
        )}
      </div>
    </div>
  );
}

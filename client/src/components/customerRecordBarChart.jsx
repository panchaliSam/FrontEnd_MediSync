import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import jsPDF from 'jspdf';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale);

const customerSegment = ['New', 'Returning', 'Regular', 'VIP'];
const provinces = [
  'Western', 'Central', 'Southern', 'Northern', 'Eastern',
  'Uva', 'Sabaragamuwa', 'North Western', 'North Central',
];

export const CustomerRecordBarChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const [selectedProvince, setSelectedProvince] = useState(provinces[0]);

  useEffect(() => {
    axios.get('http://localhost:4002/api/customerRecord')
      .then(response => {
        const data = response.data;

        // Filter data by the selected province
        const filteredData = data.filter(customer => customer.location === selectedProvince);

        // Count customers in each segment
        const segmentCounts = customerSegment.map(segment => {
          return filteredData.filter(customer => customer.customerSegment === segment).length;
        });

        // Update the chart data
        setChartData({
          labels: customerSegment,
          datasets: [
            {
              label: `Customer Segments in ${selectedProvince}`,
              data: segmentCounts,
              backgroundColor: 'rgba(153, 102, 255, 0.4)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            },
          ],
        });
      })
      .catch(error => console.error("Error fetching data:", error));
  }, [selectedProvince]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`Customer Segments in ${selectedProvince}`, 14, 20);
    doc.setFontSize(12);
    
    // Add a header for the table
    doc.text('Segment', 14, 30);
    doc.text('Count', 120, 30);
    doc.line(14, 32, 180, 32); // Horizontal line

    // Add the chart data to the PDF
    chartData.labels.forEach((label, index) => {
      const y = 40 + index * 10;
      doc.text(label, 14, y);
      doc.text(chartData.datasets[0].data[index].toString(), 120, y);
    });

    doc.save(`Customer_Segments_${selectedProvince}.pdf`);
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            return `${context.dataset.label}: ${value} customer${value > 1 ? 's' : ''}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Customer Segment',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Customers',
        },
        ticks: {
          precision: 0, // Ensure no decimal points are shown
          callback: function (value) {
            return `${value} customers`; // Display customer count with "customers" appended
          },
        },
      },
    },
  };
  

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <div className="mb-4">
        <label htmlFor="province" className="block text-sm font-medium text-gray-700">Province</label>
        <select
          id="province"
          value={selectedProvince}
          onChange={(e) => setSelectedProvince(e.target.value)}
          className='block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
        >
          {provinces.map(province => (
            <option key={province} value={province}>{province}</option>
          ))}
        </select>
      </div>
      <div className='chart-container'>
        <Bar data={chartData} options={options} />
      </div>
      <div className="mt-4">
        <button onClick={exportToPDF} className="px-4 py-2 bg-blue-500 text-white rounded">Download Records</button>
      </div>
    </div>
  );
};

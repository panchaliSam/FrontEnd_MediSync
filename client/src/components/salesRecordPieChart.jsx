import React, { useState, useEffect, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import html2canvas from 'html2canvas'; // for capturing chart as image
import jsPDF from 'jspdf'; // for generating PDF

// Register components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const productCategories = [
  'Clothing',
  'Footwear',
  'Accessories'
];

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

export const SalesRecordPieChart = () => {
  const [pieData, setPieData] = useState({
    labels: [],
    datasets: [],
  });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(months[new Date().getMonth()]);
  const chartRef = useRef(); // For capturing chart reference

  useEffect(() => {
    axios.get('http://localhost:4002/api/salesRecord')
      .then(response => {
        const data = response.data;

        // Filter and aggregate sales by product category
        const filteredData = data.filter(item =>
          item.year === selectedYear &&
          item.month === selectedMonth
        );

        // Calculate total sales for each category
        const categorySales = productCategories.map(category => {
          const categoryData = filteredData.filter(item => item.productCategory === category);
          return categoryData.reduce((total, item) => total + item.salesQuantity, 0);
        });

        const totalSales = categorySales.reduce((total, sales) => total + sales, 0);

        // Safeguard against division by zero if there are no sales
        const percentageSales = totalSales > 0 
          ? categorySales.map(sales => ((sales / totalSales) * 100).toFixed(2)) 
          : categorySales.map(() => 0);

        // Update Pie Chart data (percentage of each category)
        setPieData({
          labels: productCategories,
          datasets: [
            {
              label: `Percentage of Sales`,
              data: percentageSales,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
              hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            },
          ],
        });
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
      });
  }, [selectedYear, selectedMonth]);

  const pieOptions = {
    plugins: {
      legend: {
        display: false, // Hide the default legend
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  // Function to handle downloading the pie chart as a PDF
  const downloadPdf = () => {
    const chart = chartRef.current;
    html2canvas(chart, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 100);
      pdf.save(`Sales_Record_${selectedMonth}_${selectedYear}.pdf`);
    });
  };

  return (
    <div className="flex flex-wrap max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      {/* Control Panel */}
      <div className="w-full md:w-1/3 lg:w-1/4 p-4">
        <div className="mb-4">
          <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="month" className="block text-sm font-medium text-gray-700">Month</label>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Chart and Color Palette Section */}
      <div className="flex flex-grow p-4">
        {/* Pie Chart */}
        <div className="w-full md:w-2/3 lg:w-2/3 p-4" ref={chartRef}>
          {/* <h3 className="text-lg font-semibold mb-2">Percentage of Sales by Product Category</h3> */}
          <div className="chart-container" style={{ width: '100%', height: '500px' }}>
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>

        {/* Color Palette */}
        <div className="w-full md:w-1/3 lg:w-1/3 p-4">
          {/* <h3 className="text-lg font-semibold mb-2">Color Palette</h3> */}
          <div className="space-y-2">
            {productCategories.map((category, index) => (
              <div key={category} className="flex items-center">
                <div 
                  className="w-6 h-6 mr-2"
                  style={{ backgroundColor: pieData.datasets[0]?.backgroundColor[index] }}
                ></div>
                <span>{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with Download Button */}
      <div className="w-full flex justify-end p-4">
        <button
          onClick={downloadPdf}
          className="bg-indigo-600 text-white px-4 py-2 rounded shadow-md hover:bg-indigo-700 focus:outline-none"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

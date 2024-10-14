import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import { saveAs } from 'file-saver'; // For CSV download
import jsPDF from 'jspdf'; // For PDF generation
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const productCategories = ['Clothing', 'Footwear', 'Accessories'];
const ageRanges = ['18-25', '26-35', '36-45', '46-60', '60+'];
const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

export const CustomerRecordPieChart = () => {
  const [agePieData, setAgePieData] = useState({
    labels: [],
    datasets: [],
  });
  const [categoryPieData, setCategoryPieData] = useState({
    labels: [],
    datasets: [],
  });
  const [selectedCategory, setSelectedCategory] = useState(productCategories[0]);
  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:4002/api/customerRecord')
      .then((response) => {
        const data = response.data;
        setCustomerData(data); // Store all customer data for reporting
        
        // Process data for product category pie chart
        const categoryCounts = productCategories.reduce((acc, category) => {
          acc[category] = 0;
          return acc;
        }, {});

        data.forEach((customer) => {
          const category = customer.productCategory;
          categoryCounts[category]++;
        });

        setCategoryPieData({
          labels: Object.keys(categoryCounts),
          datasets: [
            {
              label: 'Product Category Distribution',
              data: Object.values(categoryCounts),
              backgroundColor: colors.slice(0, Object.keys(categoryCounts).length),
              hoverBackgroundColor: colors.slice(0, Object.keys(categoryCounts).length),
            },
          ],
        });

        // Process data for age range pie chart based on selected category
        const ageRangeCounts = ageRanges.reduce((acc, range) => {
          acc[range] = 0;
          return acc;
        }, {});

        const filteredData = data.filter((customer) => customer.productCategory === selectedCategory);

        filteredData.forEach((customer) => {
          const age = customer.age;
          if (age >= 18 && age <= 25) {
            ageRangeCounts['18-25']++;
          } else if (age >= 26 && age <= 35) {
            ageRangeCounts['26-35']++;
          } else if (age >= 36 && age <= 45) {
            ageRangeCounts['36-45']++;
          } else if (age >= 46 && age <= 60) {
            ageRangeCounts['46-60']++;
          } else if (age > 60) {
            ageRangeCounts['60+']++;
          }
        });

        setAgePieData({
          labels: Object.keys(ageRangeCounts),
          datasets: [
            {
              label: 'Age Range Distribution for ' + selectedCategory,
              data: Object.values(ageRangeCounts),
              backgroundColor: colors.slice(0, Object.keys(ageRangeCounts).length),
              hoverBackgroundColor: colors.slice(0, Object.keys(ageRangeCounts).length),
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [selectedCategory]);

  const generatePDFReport = () => {
    const doc = new jsPDF();
  
    // Set title
    doc.setFontSize(16);
    doc.text("Customer Records Report", 14, 10);
    
    // Add selected category
    doc.setFontSize(12);
    doc.text("Selected Product Category: " + selectedCategory, 14, 20);
    
    // Add Age Distribution
    doc.setFontSize(14);
    doc.text("Age Distribution:", 14, 30);
    
    // Set styles for data
    doc.setFontSize(12);
    let yPosition = 40; // Start Y position for data
  
    agePieData.labels.forEach((label, index) => {
      doc.text(`${label}: ${agePieData.datasets[0].data[index]}`, 14, yPosition);
      yPosition += 10; // Increment Y position for the next item
    });
  
    // Check if we need to add a new page for the category distribution
    if (yPosition > 270) { // If Y position exceeds page limit
      doc.addPage();
      yPosition = 20; // Reset Y position for the new page
    }
  
    // Add Product Category Distribution
    doc.setFontSize(14);
    doc.text("Product Category Distribution:", 14, yPosition);
    yPosition += 10; // Move down for data
  
    categoryPieData.labels.forEach((label, index) => {
      doc.text(`${label}: ${categoryPieData.datasets[0].data[index]}`, 14, yPosition);
      yPosition += 10; // Increment Y position for the next item
    });
  
    // Finalize the PDF
    doc.save("CustomerReport.pdf");
  };
  

  const generateCSVReport = () => {
    const csvData = customerData.map(customer => ({
      Name: customer.name,
      Age: customer.age,
      ProductCategory: customer.productCategory,
      // Add other relevant fields here
    }));

    const csvContent = "data:text/csv;charset=utf-8," + 
      ['Name,Age,ProductCategory'].concat(csvData.map(e => `${e.Name},${e.Age},${e.ProductCategory}`)).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customer_records.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pieOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col lg:flex-row lg:space-x-8">
        {/* Product Category Pie Chart */}
        <div className="flex-1 lg:w-1/2 mb-6 lg:mb-0">
          <h3 className="text-lg font-semibold mb-4">Product Category Distribution</h3>
          <div className="relative" style={{ height: '300px' }}>
            <Pie data={categoryPieData} options={pieOptions} />
          </div>
        </div>

        {/* Legend for Product Categories */}
        <div className="lg:w-1/2 mb-6 lg:mb-0 flex flex-col">
          <h3 className="text-lg font-semibold mb-4">Categories Legend</h3>
          <div className="flex flex-col space-y-2">
            {productCategories.map((category, index) => (
              <div key={category} className="flex items-center">
                <div
                  className="w-5 h-5 mr-2 rounded-full"
                  style={{ backgroundColor: colors[index] }}
                />
                <span className="text-sm">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-8 mt-8">
        {/* Age Range Pie Chart Section */}
        <div className="flex-1 lg:w-1/2 mb-6 lg:mb-0">
          <h3 className="text-lg font-semibold mb-4">Age Range Distribution for {selectedCategory}</h3>
          <div className="relative" style={{ height: '300px' }}>
            <Pie data={agePieData} options={pieOptions} />
          </div>
          <div className="mt-4">
            <label htmlFor="productCategory" className="block text-sm font-medium text-gray-700">Select Product Category</label>
            <select
              id="productCategory"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {productCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Legend for Age Ranges */}
        <div className="lg:w-1/2 mt-6 lg:mt-0">
          <h3 className="text-lg font-semibold mb-4">Age Ranges Legend</h3>
          <div className="flex flex-col space-y-2">
            {ageRanges.map((range, index) => (
              <div key={range} className="flex items-center">
                <div
                  className="w-5 h-5 mr-2 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-sm">{range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Buttons for Report Generation */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={generatePDFReport}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Generate PDF Report
        </button>
        <button
          onClick={generateCSVReport}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Download CSV Report
        </button>
      </div>
    </div>
  );
};

export default CustomerRecordPieChart;

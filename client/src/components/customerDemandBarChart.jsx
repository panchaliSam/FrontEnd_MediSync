import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';

// Register components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

// Define the seasons
const sriLankanSeasons = [
  'Sinhala and Tamil New Year',
  'Christmas Season',
  'Easter Season',
  'Black Friday',
  "Women's Day",
  "Valentine's Day"
];

export const SeasonalDemandBarChart = () => {
  const [chartData, setChartData] = useState({
    labels: [], // Years will be set here
    datasets: [],
  });
  const [selectedSeason, setSelectedSeason] = useState(sriLankanSeasons[0]);
  const [years, setYears] = useState([]); // State to store years from the fetched data

  useEffect(() => {
    // Fetch data when the selected season changes
    axios.get('http://localhost:4002/api/seasonalDemand')
      .then(response => {
        const data = response.data; 
        console.log(data); // Debug: Check if the data is correct

        // Filter data based on the selected season
        const filteredData = data.filter(item => item.season === selectedSeason);

        // Extract years and corresponding noOfTransactions
        const transactionsByYear = {};
        filteredData.forEach(item => {
          const year = item.year;
          if (!transactionsByYear[year]) {
            transactionsByYear[year] = 0; // Initialize if year not already present
          }
          transactionsByYear[year] += item.noOfTransactions; // Aggregate transactions
        });

        // Prepare the data for the chart
        const yearsArray = Object.keys(transactionsByYear);
        const transactionValues = yearsArray.map(year => transactionsByYear[year]);

        // Update the chart data state
        setChartData({
          labels: yearsArray,
          datasets: [
            {
              label: `Number of Transactions for ${selectedSeason}`,
              data: transactionValues, // Set the transactions data here
              backgroundColor: 'rgba(75,192,192,0.4)',
              borderColor: 'rgba(75,192,192,1)',
              borderWidth: 1,
            },
          ],
        });

        setYears(yearsArray); // Set years for potential use
      })
      .catch(error => {
        console.error("Error fetching customer demand data: ", error);
      });
  }, [selectedSeason]);

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}`; // Tooltip shows the transaction value
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year'
        }
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Transactions' // Y-axis label
        },
        min: 0, // Start from 0
        max: 10000 // Adjust based on your data range
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <div className="mb-4">
        <label htmlFor="season" className="block text-sm font-medium text-gray-700">Select Season</label>
        <select
          id="season"
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {sriLankanSeasons.map(season => (
            <option key={season} value={season}>{season}</option>
          ))}
        </select>
      </div>

      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

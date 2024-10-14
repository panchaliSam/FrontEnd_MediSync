import { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement
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

export const SeasonalDemandPieChart = () => {
  const [pieChartData, setPieChartData] = useState({
    labels: [], // Years will be set here
    datasets: [],
  });
  const [selectedSeason, setSelectedSeason] = useState(sriLankanSeasons[0]);

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

        // Prepare the data for the pie chart
        const yearsArray = Object.keys(transactionsByYear);
        const transactionValues = yearsArray.map(year => transactionsByYear[year]);

        // Update the pie chart data state
        setPieChartData({
          labels: yearsArray,
          datasets: [
            {
              label: `Number of Transactions for ${selectedSeason}`,
              data: transactionValues,
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)', 
                'rgba(54, 162, 235, 0.6)', 
                'rgba(255, 206, 86, 0.6)', 
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)', 
                'rgba(255, 159, 64, 0.6)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)', 
                'rgba(54, 162, 235, 1)', 
                'rgba(255, 206, 86, 1)', 
                'rgba(75, 192, 192, 1)', 
                'rgba(153, 102, 255, 1)', 
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1,
            },
          ],
        });
      })
      .catch(error => {
        console.error("Error fetching seasonal demand data: ", error);
      });
  }, [selectedSeason]);

  // Pie chart options
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom dimensions
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw}`; // Tooltip shows the transaction value
          }
        }
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

      <div className="flex justify-center items-center" style={{ width: '400px', height: '400px' }}>
        <Pie data={pieChartData} options={pieOptions} />
      </div>
    </div>
  );
};

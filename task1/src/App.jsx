import { useEffect, useState } from 'react';
import SingleBarChart from '@/components/SingleBarChart.jsx';
import BarChart from '@/components/BarChart.jsx';
import PieChart from '@/components/PieChart.jsx';
import GaugeChart from '@/components/GaugeChart.jsx'; // Import the new GaugeChart component
import { Button } from "@/components/ui/button";
import './App.css';

export default function App() {
  const [data, setData] = useState([]);

  // Read the active version from localStorage on initial render
  const [activeVersion, setActiveVersion] = useState(() => {
    const savedVersion = localStorage.getItem('activeChartVersion');
    return savedVersion || 'v1';
  });

  // Effect to fetch data on component mount
  useEffect(() => {
    console.log('Fetching data...');
    fetch('/data.json')
      .then(res => {
         if (!res.ok) {
           throw new Error(`HTTP error! status: ${res.status}`);
         }
         return res.json();
      })
      .then(data => {
        setData(data);
        console.log('Data fetched successfully:', data);
      })
      .catch(err => console.error("Error loading data:", err));
  }, []);

  // Effect to save the active version to localStorage whenever it changes
  useEffect(() => {
    console.log('Saving active version to localStorage:', activeVersion);
    localStorage.setItem('activeChartVersion', activeVersion);
  }, [activeVersion]);

  return (
    <div className="h-[90vh] px-20 py-10 bg-gray-50">
      <div className="flex justify-center mb-10">
        <div className="flex gap-4">
          {/* Version 1 Button */}
          <Button
            onClick={() => setActiveVersion('v1')}
            className={`px-6 py-2 font-semibold rounded transition ${
              activeVersion === 'v1'
                ? 'bg-black text-white hover:bg-black'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Version 1
          </Button>
          {/* Version 2 Button */}
          <Button
            onClick={() => setActiveVersion('v2')}
            className={`px-6 py-2 font-semibold rounded transition ${
              activeVersion === 'v2'
                ? 'bg-black text-white hover:bg-black'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Version 2
          </Button>
          {/* Version 3 (Pie Chart) Button */}
          <Button
            onClick={() => setActiveVersion('v3')}
            className={`px-6 py-2 font-semibold rounded transition ${
              activeVersion === 'v3'
                ? 'bg-black text-white hover:bg-black'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Version 3
          </Button>
           {/* Version 4 (Gauge Chart) Button */}
           <Button
            onClick={() => setActiveVersion('v4')}
            className={`px-6 py-2 font-semibold rounded transition ${
              activeVersion === 'v4'
                ? 'bg-black text-white hover:bg-black'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Version 4
          </Button>
        </div>
      </div>

      <section className="bg-white px-10 py-8 rounded-lg shadow space-y-4">
        {/* Dynamic Title based on active version */}
        <h2 className="text-2xl font-bold text-center">
          {activeVersion === 'v1'
            ? 'Variation – Single Color Scale'
            : activeVersion === 'v2'
              ? 'Variation – Comparison View'
              : activeVersion === 'v3'
                ? 'Variation – Pie Chart View'
                : 'Variation – Sales Gauge Chart' // Title for Version 4
          }
        </h2>
        {/* Conditional Rendering of the chart based on active version */}
        {data.length > 0 ? (
          activeVersion === 'v1' ? (
            <SingleBarChart data={data} />
          ) : activeVersion === 'v2' ? (
            <BarChart data={data} />
          ) : activeVersion === 'v3' ? (
            <PieChart data={data} />
          ) : activeVersion === 'v4' ? (
            <GaugeChart />
          ) : null // Fallback
        ) : (
          <p className="text-center text-gray-500">Loading data...</p>
        )}
      </section>
    </div>
  );
}

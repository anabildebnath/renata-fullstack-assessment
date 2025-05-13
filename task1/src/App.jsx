import { useEffect, useState } from 'react';
import SingleBarChart from '@/components/SingleBarChart.jsx';
import BarChart from '@/components/BarChart.jsx';
import { Button } from "@/components/ui/button";
import './App.css';

export default function App() {
  const [data, setData] = useState([]);
  const [activeVersion, setActiveVersion] = useState('v1');

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error("Error loading data:", err));
  }, []);

  return (
    <div className="h-[85vh] px-20 py-10 bg-gray-50">
      <div className="flex justify-center mb-10">
        <div className="flex gap-4">
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
        </div>
      </div>

      <section className="bg-white px-10 py-8 rounded-lg shadow space-y-4">
        <h2 className="text-2xl font-bold text-center">
          {activeVersion === 'v1' ? 'Variation – Single Color Scale' : 'Variation – Comparison View'}
        </h2>
        {data.length > 0 ? (
          activeVersion === 'v1' ? <SingleBarChart data={data} /> : <BarChart data={data} />
        ) : (
          <p className="text-center text-gray-500">Loading data...</p>
        )}
      </section>
    </div>
  );
}

// File: src/App.jsx
import { useState } from 'react';
import SingleBarChart from '@/components/SingleBarChart.jsx';
import BarChart from '@/components/BarChart.jsx';
import { barData } from './data.js';
import './App.css';
export default function App() {
  const [activeVersion, setActiveVersion] = useState('v1');

  return (
    <div className="min-h-screen px-20 py-10 bg-gray-50">
      {/* Top Centered Button Toggle */}
      <div className="flex justify-center mb-10">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveVersion('v1')}
            className={`px-6 py-2 rounded font-semibold transition ${
              activeVersion === 'v1'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Version 1
          </button>
          <button
            onClick={() => setActiveVersion('v2')}
            className={`px-6 py-2 rounded font-semibold transition ${
              activeVersion === 'v2'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Version 2
          </button>
        </div>
      </div>

      {/* Chart Display Section */}
      <section className="bg-white px-10 py-8 rounded-lg shadow space-y-4">
        <h2 className="text-2xl font-bold text-center">
          {activeVersion === 'v1' ? 'Variation – Single Color Scale' : 'Variation – Comparison View'}
        </h2>
        {activeVersion === 'v1' ? (
          <SingleBarChart data={barData} />
        ) : (
          <BarChart data={barData} />
        )}
      </section>
    </div>
  );
}

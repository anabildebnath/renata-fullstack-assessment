import React from 'react';
import BarChart from '@/components/BarChart.jsx';
import SingleBarChart from '@/components/SingleBarChart.jsx';
import { barData } from './data.js';

export default function App() {
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Interactive Bar Chart</h1>
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <BarChart data={barData} />
      </div>

      <h2 className="text-xl font-semibold mb-4">Single‑Variable Sales Chart</h2>
      <div className="bg-white p-4 rounded-lg shadow">
        <SingleBarChart data={barData} />
      </div>
    </div>
  );
}

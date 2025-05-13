import React from 'react';
import SingleBarChart from '@/components/SingleBarChart.jsx';
import BarChart       from '@/components/BarChart.jsx';
import { barData }    from './data.js';

export default function App() {
  return (
    <div className="min-h-screen px-20 py-10 bg-gray-50 space-y-16">
      {/* First variation */}
      <section className="bg-white px-10 py-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">variation‑example copy</h2>
        <SingleBarChart data={barData} />
      </section>

      {/* Second variation */}
      <section className="bg-white px-10 py-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">variation‑comparison version</h2>
        <BarChart data={barData} />
      </section>
    </div>
  );
}

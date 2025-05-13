import React from 'react';

const colorRanges = [
  { color: 'bg-red-950', label: '40–36' },
  { color: 'bg-orange-700', label: '35–31' },
  { color: 'bg-orange-600', label: '30–26' },
  { color: 'bg-orange-400', label: '25–21' },
  { color: 'bg-orange-300', label: '20–16' },
  { color: 'bg-orange-200', label: '15–11' },
  { color: 'bg-orange-100', label: '10–6' },
  { color: 'bg-orange-50',  label: '5–0' },
];

export default function LegendBrush() {
  return (
    <div className="flex flex-col justify-between items-start space-y-1">
      {colorRanges.map((range, i) => (
        <div key={i} className="flex items-center space-x-2">
          <div className={`w-6 h-6 rounded-sm ${range.color}`} />
          <span className="text-sm font-medium text-gray-700">{range.label}</span>
        </div>
      ))}
    </div>
  );
}

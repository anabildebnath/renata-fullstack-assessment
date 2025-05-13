import React from 'react';

export default function LegendBrush({ ranges }) {
  return (
    <div className="flex flex-col justify-between items-start space-y-1">
      {ranges.map((range, i) => (
        <div key={i} className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-sm" style={{ backgroundColor: range.color }} />
          <span className="text-sm font-medium text-gray-700">{range.label}</span>
        </div>
      ))}
    </div>
  );
}

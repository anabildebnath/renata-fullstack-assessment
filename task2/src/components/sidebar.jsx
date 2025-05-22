import React from "react";
import { Link } from "react-router-dom";

export function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-4">
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </div>
      <nav className="mt-2">
        {/* Other navigation links */}
        <Link 
          to="/analytics" 
          className="flex items-center p-2 hover:bg-gray-100"
        >
          {/* Your analytics icon */}
          <span>Analytics</span>
        </Link>
        {/* Other navigation links */}
      </nav>
    </div>
  );
}
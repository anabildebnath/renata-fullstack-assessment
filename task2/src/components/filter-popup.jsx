"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export function FilterPopup({ isOpen, onClose, onApplyFilter, onResetFilter }) {
  const [filters, setFilters] = React.useState({
    CustomerName: "",
    Division: "all",
    Gender: "all",
    MaritalStatus: "all",
    Age: "",
    Income: "",
  });

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onApplyFilter(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      CustomerName: "",
      Division: "all",
      Gender: "all",
      MaritalStatus: "all",
      Age: "",
      Income: "",
    });
    onResetFilter();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div
        className="dialog-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose(); // Close the popup only when clicking outside the modal content
          }
        }}
      >
        <DialogContent
          className="popup-form relative"
          style={{
            backgroundColor: "#0a0a0a", // Solid pitch-dark background color
            color: "#ffffff", // Ensure text is visible on the dark background
            borderRadius: "8px", // Rounded corners
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.8)", // Shadow for better visibility
            maxWidth: "600px", // Maximum width
            width: "100%", // Full width up to the maxWidth
          }}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the form
        >
          <DialogHeader>
            <DialogTitle>Filter Records</DialogTitle>
          </DialogHeader>
          <button
            className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-1 hover:bg-red-600"
            onClick={onClose} // Close the popup when clicking the close button
          >
            ✕
          </button>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Customer Name</label>
              <Input
                value={filters.CustomerName}
                onChange={(e) => handleInputChange("CustomerName", e.target.value)}
                placeholder="Enter customer name"
                className="w-full" // Ensure consistent width
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Division</label>
              <Select
                value={filters.Division}
                onValueChange={(value) => handleInputChange("Division", value)}
                className="w-full" // Ensure consistent width
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select division" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Dhaka">Dhaka</SelectItem>
                  <SelectItem value="Chattogram">Chattogram</SelectItem>
                  <SelectItem value="Rajshahi">Rajshahi</SelectItem>
                  <SelectItem value="Khulna">Khulna</SelectItem>
                  <SelectItem value="Barishal">Barishal</SelectItem>
                  <SelectItem value="Sylhet">Sylhet</SelectItem>
                  <SelectItem value="Rangpur">Rangpur</SelectItem>
                  <SelectItem value="Mymensingh">Mymensingh</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium">Gender</label>
              <Select
                value={filters.Gender}
                onValueChange={(value) => handleInputChange("Gender", value)}
                className="w-full" // Ensure consistent width
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium">Marital Status</label>
              <Select
                value={filters.MaritalStatus}
                onValueChange={(value) => handleInputChange("MaritalStatus", value)}
                className="w-full" // Ensure consistent width
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Married">Married</SelectItem>
                  <SelectItem value="Divorced">Divorced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium">Age</label>
              <Input
                type="number"
                value={filters.Age}
                onChange={(e) => handleInputChange("Age", e.target.value)}
                placeholder="Enter age"
                className="w-full" // Ensure consistent width
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Income</label>
              <Input
                type="number"
                value={filters.Income}
                onChange={(e) => handleInputChange("Income", e.target.value)}
                placeholder="Enter income"
                className="w-full" // Ensure consistent width
              />
            </div>
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <button className="btn btn-secondary" onClick={handleReset}>
              Reset
            </button>
            <button className="btn btn-primary" onClick={handleApply}>
              Apply
            </button>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

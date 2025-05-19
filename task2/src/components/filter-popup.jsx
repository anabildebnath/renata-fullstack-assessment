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
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Filter Records</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Customer Name</label>
            <Input
              value={filters.CustomerName}
              onChange={(e) => handleInputChange("CustomerName", e.target.value)}
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Division</label>
            <Select
              value={filters.Division}
              onValueChange={(value) => handleInputChange("Division", value)}
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
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Income</label>
            <Input
              type="number"
              value={filters.Income}
              onChange={(e) => handleInputChange("Income", e.target.value)}
              placeholder="Enter income"
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
    </Dialog>
  );
}

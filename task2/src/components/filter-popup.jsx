"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select"; // Import MultiSelect component

export function FilterPopup({ isOpen, onClose, onApplyFilter, onResetFilter }) {
  const [filters, setFilters] = React.useState({
    CustomerName: "",
    Division: [],
    Gender: [],
    MaritalStatus: [],
    AgeRange: [0, 100], // Default range for Age
    IncomeRange: [0, 100000], // Default range for Income
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
      Division: [],
      Gender: [],
      MaritalStatus: [],
      AgeRange: [0, 100],
      IncomeRange: [0, 100000],
    });
    onResetFilter();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="popup-form">
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
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Division</label>
            <MultiSelect
              options={[
                "Dhaka",
                "Chattogram",
                "Rajshahi",
                "Khulna",
                "Barishal",
                "Sylhet",
                "Rangpur",
                "Mymensingh",
              ]}
              selected={filters.Division}
              onChange={(value) => handleInputChange("Division", value)}
              placeholder="Select divisions"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Gender</label>
            <MultiSelect
              options={["Male", "Female", "Other"]}
              selected={filters.Gender}
              onChange={(value) => handleInputChange("Gender", value)}
              placeholder="Select genders"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Marital Status</label>
            <MultiSelect
              options={["Single", "Married", "Divorced"]}
              selected={filters.MaritalStatus}
              onChange={(value) => handleInputChange("MaritalStatus", value)}
              placeholder="Select marital statuses"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Age Range</label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={filters.AgeRange[0]}
                onChange={(e) =>
                  handleInputChange("AgeRange", [Number(e.target.value), filters.AgeRange[1]])
                }
                placeholder="Min age"
              />
              <Input
                type="number"
                value={filters.AgeRange[1]}
                onChange={(e) =>
                  handleInputChange("AgeRange", [filters.AgeRange[0], Number(e.target.value)])
                }
                placeholder="Max age"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Income Range</label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={filters.IncomeRange[0]}
                onChange={(e) =>
                  handleInputChange("IncomeRange", [Number(e.target.value), filters.IncomeRange[1]])
                }
                placeholder="Min income"
              />
              <Input
                type="number"
                value={filters.IncomeRange[1]}
                onChange={(e) =>
                  handleInputChange("IncomeRange", [filters.IncomeRange[0], Number(e.target.value)])
                }
                placeholder="Max income"
              />
            </div>
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

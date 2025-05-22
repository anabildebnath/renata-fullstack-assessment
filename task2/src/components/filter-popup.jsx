"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select"; // Import MultiSelect component
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
      <div
        className="filter-popup-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <DialogContent
          className="filter-popup"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl font-semibold">
              Filter Records
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6">
            {/* Customer Name Field */}
            <div className="filter-row">
              <Label className="filter-label">Customer Name</Label>
              <Input
                id="customerName"
                value={filters.CustomerName}
                onChange={(e) =>
                  handleInputChange("CustomerName", e.target.value)
                }
                placeholder="Search by name..."
                className="w-full"
              />
            </div>

            {/* Division Field */}
            <div className="filter-row">
              <Label className="filter-label">Division</Label>
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
                className="w-full flex flex-wrap gap-2 p-2 min-h-[42px] border rounded-md bg-transparent"
              />
            </div>

            {/* Gender Field */}
            <div className="filter-row">
              <Label className="filter-label">Gender</Label>
              <MultiSelect
                options={["Male", "Female", "Other"]}
                selected={filters.Gender}
                onChange={(value) => handleInputChange("Gender", value)}
                placeholder="Select genders"
                className="w-full border rounded-md "
              />
            </div>

            {/* Marital Status Field */}
            <div className="filter-row">
              <Label className="filter-label">Marital Status</Label>
              <MultiSelect
                options={["Single", "Married", "Divorced"]}
                selected={filters.MaritalStatus}
                onChange={(value) => handleInputChange("MaritalStatus", value)}
                placeholder="Select marital status"
                className="w-full border rounded-md"
              />
            </div>

            {/* Age Range */}
            <div className="filter-row">
              <Label className="filter-label">Age Range</Label>
              <div className="flex items-center gap-4">
                <div className="grid gap-1.5 flex-1">
                  <Label
                    htmlFor="minAge"
                    className="text-sm text-muted-foreground"
                  >
                    Min
                  </Label>
                  <Input
                    id="minAge"
                    type="number"
                    value={filters.AgeRange[0]}
                    onChange={(e) =>
                      handleInputChange("AgeRange", [
                        Number(e.target.value),
                        filters.AgeRange[1],
                      ])
                    }
                    placeholder="0"
                    className="w-full"
                  />
                </div>
                <div className="grid gap-1.5 flex-1">
                  <Label
                    htmlFor="maxAge"
                    className="text-sm text-muted-foreground"
                  >
                    Max
                  </Label>
                  <Input
                    id="maxAge"
                    type="number"
                    value={filters.AgeRange[1]}
                    onChange={(e) =>
                      handleInputChange("AgeRange", [
                        filters.AgeRange[0],
                        Number(e.target.value),
                      ])
                    }
                    placeholder="100"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Income Range */}
            <div className="filter-row">
              <Label className="filter-label">Income Range</Label>
              <div className="flex items-center gap-4">
                <div className="grid gap-1.5 flex-1">
                  <Label
                    htmlFor="minIncome"
                    className="text-sm text-muted-foreground"
                  >
                    Min
                  </Label>
                  <Input
                    id="minIncome"
                    type="number"
                    value={filters.IncomeRange[0]}
                    onChange={(e) =>
                      handleInputChange("IncomeRange", [
                        Number(e.target.value),
                        filters.IncomeRange[1],
                      ])
                    }
                    placeholder="0"
                    className="w-full"
                  />
                </div>
                <div className="grid gap-1.5 flex-1">
                  <Label
                    htmlFor="maxIncome"
                    className="text-sm text-muted-foreground"
                  >
                    Max
                  </Label>
                  <Input
                    id="maxIncome"
                    type="number"
                    value={filters.IncomeRange[1]}
                    onChange={(e) =>
                      handleInputChange("IncomeRange", [
                        filters.IncomeRange[0],
                        Number(e.target.value),
                      ])
                    }
                    placeholder="100000"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={handleReset}>
              Reset Filters
            </Button>
            <Button onClick={handleApply}>Apply Filters</Button>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { FilterPopup } from "@/components/filter-popup"; // Import the filter popup
import rawData from "./data.json";

export default function App() {
  const [data, setData] = useState(() => {
    try {
      const savedData = localStorage.getItem("data");
      return savedData ? JSON.parse(savedData) : rawData;
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
      return rawData; // Fallback to rawData if localStorage fails
    }
  });

  const [filteredData, setFilteredData] = useState(data); // Filtered data state
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Filter popup state
  const [isFormOpen, setIsFormOpen] = useState(false); // Form popup state

  useEffect(() => {
    try {
      const compressedData = JSON.stringify(data);
      localStorage.setItem("data", compressedData);
    } catch (error) {
      if (error.name === "QuotaExceededError") {
        console.warn("LocalStorage quota exceeded. Data will not be saved.");
      } else {
        console.error("Failed to save data to localStorage:", error);
      }
    }
  }, [data]);

  const handleApplyFilter = (filters) => {
    console.log("Applying filters:", filters); // Debugging: Log the filters

    const filtered = data.filter((record) => {
      return (
        (!filters.CustomerName || record.CustomerName.toLowerCase().includes(filters.CustomerName.toLowerCase())) &&
        (filters.Division === "all" || record.Division === filters.Division) &&
        (filters.Gender === "all" || record.Gender === filters.Gender) &&
        (filters.MaritalStatus === "all" || record.MaritalStatus === filters.MaritalStatus) &&
        (!filters.Age || record.Age === Number(filters.Age)) &&
        (!filters.Income || record.Income === Number(filters.Income))
      );
    });

    console.log("Filtered data:", filtered); // Debugging: Log the filtered data
    setFilteredData(filtered);
    setIsFilterOpen(false); // Close the filter popup after applying filters
  };

  const handleResetFilter = () => {
    setFilteredData(data); // Reset to the original data
    setIsFilterOpen(false); // Close the filter popup
  };

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-background text-foreground">
        <AppSidebar setIsFormOpen={setIsFormOpen} setIsFilterOpen={setIsFilterOpen} />
        <SidebarInset>
          <SiteHeader />
          <main className="flex flex-1 flex-col p-6">
            <SectionCards data={filteredData} />
            <div className="mt-6">
              <ChartAreaInteractive data={filteredData} />
            </div>
            <div className="mt-6">
              <DataTable
                data={filteredData}
                onAddRecord={(newRecord) => setData((prev) => [...prev, newRecord])}
                onDeleteRecord={(id) => setData((prev) => prev.filter((record) => record.ID !== id))}
                onEditRecord={(id, updatedRecord) =>
                  setData((prev) =>
                    prev.map((record) => (record.ID === id ? { ...record, ...updatedRecord } : record))
                  )
                }
                isFormOpen={isFormOpen} // Pass isFormOpen
                setIsFormOpen={setIsFormOpen} // Pass setIsFormOpen
              />
            </div>
          </main>
        </SidebarInset>
      </div>
      <FilterPopup
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilter={handleApplyFilter}
        onResetFilter={handleResetFilter}
      />
    </SidebarProvider>
  );
}

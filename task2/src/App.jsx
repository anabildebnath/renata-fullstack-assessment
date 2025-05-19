import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { FilterPopup } from "@/components/filter-popup";
import AnalyticsPage from "@/pages/analytics";
import rawData from "./data.json";

export default function App() {
  const [data, setData] = useState(() => {
    try {
      const savedData = localStorage.getItem("data");
      return savedData ? JSON.parse(savedData) : rawData;
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
      return rawData;
    }
  });

  const [filteredData, setFilteredData] = useState(data);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
    const filtered = data.filter((record) => {
      const normalizedGender =
        record.Gender === "M" ? "Male" : record.Gender === "F" ? "Female" : record.Gender;

      return (
        (!filters.CustomerName || record.CustomerName.toLowerCase().includes(filters.CustomerName.toLowerCase().trim())) &&
        (filters.Division === "all" || record.Division === filters.Division) &&
        (filters.Gender === "all" || normalizedGender === filters.Gender) &&
        (filters.MaritalStatus === "all" || record.MaritalStatus === filters.MaritalStatus) &&
        (!filters.Age || record.Age === Number(filters.Age)) &&
        (!filters.Income || record.Income === Number(filters.Income))
      );
    });

    setFilteredData(filtered);
    setIsFilterOpen(false);
  };

  const handleResetFilter = () => {
    setFilteredData(data);
    setIsFilterOpen(false);
  };

  const handleAddRecord = (newRecord) => {
    const timestampedRecord = { ...newRecord, addedAt: new Date().toISOString() };
    setData((prevData) => {
      const updatedData = [...prevData, timestampedRecord];
      setFilteredData(updatedData);
      return updatedData;
    });
  };

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-background text-foreground">
        <AppSidebar setIsFormOpen={setIsFormOpen} setIsFilterOpen={setIsFilterOpen} />
        <SidebarInset>
          <SiteHeader />
          <main className="flex flex-1 flex-col p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/dashboard"
                element={
                  <>
                    <SectionCards data={filteredData} />
                    <div className="mt-6">
                      <ChartAreaInteractive data={filteredData} />
                    </div>
                    <div className="mt-6">
                      <DataTable
                        data={filteredData}
                        onAddRecord={handleAddRecord}
                        onDeleteRecord={(id) => setData((prev) => prev.filter((record) => record.ID !== id))}
                        onEditRecord={(id, updatedRecord) =>
                          setData((prev) =>
                            prev.map((record) => (record.ID === id ? { ...record, ...updatedRecord } : record))
                          )
                        }
                        isFormOpen={isFormOpen}
                        setIsFormOpen={setIsFormOpen}
                      />
                    </div>
                  </>
                }
              />
              <Route path="/analytics" element={<AnalyticsPage data={filteredData} />} />
            </Routes>
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

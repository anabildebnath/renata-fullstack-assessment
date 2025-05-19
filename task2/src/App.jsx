import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar"; // Restore AppSidebar
import { SiteHeader } from "@/components/site-header";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
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

  const [isFormOpen, setIsFormOpen] = useState(false); // Popup state
  const searchInputRef = React.useRef(null); // Create a ref for the search input

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

  const handleAddRecord = (newRecord) => {
    setData((prevData) => [...prevData, newRecord]);
  };

  const handleDeleteRecord = (id) => {
    setData((prevData) => prevData.filter((record) => record.ID !== id));
  };

  const handleEditRecord = (id, updatedRecord) => {
    setData((prevData) =>
      prevData.map((record) => (record.ID === id ? { ...record, ...updatedRecord } : record))
    );
  };

  const setSearchFocus = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus(); // Focus on the search input
    }
  };

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-background text-foreground">
        <AppSidebar setIsFormOpen={setIsFormOpen} onSearchClick={setSearchFocus} /> {/* Pass setIsFormOpen */}
        <SidebarInset>
          <SiteHeader />
          <main className="flex flex-1 flex-col p-6">
            <SectionCards data={data} />
            <div className="mt-6">
              <ChartAreaInteractive data={data} />
            </div>
            <div className="mt-6">
              <DataTable
                data={data}
                onAddRecord={handleAddRecord}
                onDeleteRecord={handleDeleteRecord}
                onEditRecord={handleEditRecord}
                isFormOpen={isFormOpen} // Pass isFormOpen
                setIsFormOpen={setIsFormOpen} // Pass setIsFormOpen
                searchInputRef={searchInputRef} // Pass searchInputRef
              />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

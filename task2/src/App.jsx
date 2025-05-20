import React, { useContext, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { AuthProvider, AuthContext } from "@/context/AuthContext";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import AnalyticsPage from "@/pages/analytics";
import Dashboard from "@/pages/Dashboard";
import ExcelFilesPage from "@/pages/ExcelFilesPage";
import rawData from "./data.json";
import "@/index.css";
import { FormModal } from "@/components/ui/form";
import { FilterPopup } from "@/components/filter-popup";
import { ProtectedRoute } from "@/components/ProtectedRoute"; // Import ProtectedRoute

function AppContent() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(() => {
    // Initialize data from localStorage or use empty array if nothing stored
    const storedData = localStorage.getItem("data");
    return storedData ? JSON.parse(storedData) : [];
  });
  const [filteredData, setFilteredData] = useState([]);

  // Initialize filteredData with data on component mount
  useEffect(() => {
    setFilteredData(data);
  }, []); // Run only once on mount

  const handleDeleteRecord = (id) => {
    const updatedData = data.filter((record) => record.ID !== id);
    setData(updatedData);
    setFilteredData(updatedData);
    localStorage.setItem("data", JSON.stringify(updatedData));
  };

  const handleDeleteSelectedRecords = (selectedIds) => {
    const updatedData = data.filter(record => !selectedIds.includes(record.ID));
    setData(updatedData);
    setFilteredData(updatedData);
    localStorage.setItem("data", JSON.stringify(updatedData));
  };

  const handleAddRecord = (newRecordOrData) => {
    let updatedData;
    
    if (Array.isArray(newRecordOrData)) {
      if (newRecordOrData.some(record => record.ID && data.find(r => r.ID === record.ID))) {
        // This is an update operation - replace entire data
        updatedData = newRecordOrData;
      } else {
        // This is a batch insert - append new records
        const timestamp = Date.now();
        updatedData = [
          ...data,
          ...newRecordOrData.map((record, index) => ({
            ...record,
            ID: `BATCH${timestamp}_${index}`,
            addedAt: new Date().toISOString()
          }))
        ];
      }
    } else {
      // Single record operation
      if (newRecordOrData.ID && data.find(r => r.ID === newRecordOrData.ID)) {
        // This is an update operation - replace the matching record
        updatedData = data.map(record => 
          record.ID === newRecordOrData.ID ? newRecordOrData : record
        );
      } else {
        // This is an insert operation - append new record
        updatedData = [
          ...data,
          {
            ...newRecordOrData,
            ID: `SINGLE${Date.now()}`,
            addedAt: new Date().toISOString()
          }
        ];
      }
    }
    
    setData(updatedData);
    setFilteredData(updatedData);
    localStorage.setItem("data", JSON.stringify(updatedData));
  };

  const handleEditRecord = (id, updatedRecord) => {
    const updatedData = data.map(record => 
      record.ID === id 
        ? { ...record, ...updatedRecord, ID: id } // Preserve the ID and merge updates
        : record
    );
    
    setData(updatedData);
    setFilteredData(updatedData);
    localStorage.setItem("data", JSON.stringify(updatedData));
  };

  const handleApplyFilter = (filters) => {
    const filtered = data.filter((record) => {
      // Convert gender format for comparison
      const normalizedGender =
        record.Gender === "F" ? "Female" : 
        record.Gender === "M" ? "Male" : 
        record.Gender;

      return (
        (!filters.CustomerName ||
          record.CustomerName.toLowerCase().includes(filters.CustomerName.toLowerCase().trim())) &&
        (filters.Division.length === 0 || filters.Division.includes(record.Division)) &&
        (filters.Gender.length === 0 || filters.Gender.includes(normalizedGender)) &&
        (filters.MaritalStatus.length === 0 || filters.MaritalStatus.includes(record.MaritalStatus)) &&
        (record.Age >= filters.AgeRange[0] && record.Age <= filters.AgeRange[1]) &&
        (record.Income >= filters.IncomeRange[0] && record.Income <= filters.IncomeRange[1])
      );
    });

    setFilteredData(filtered);
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-background text-foreground">
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <main className="flex flex-1 flex-col p-6">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard
                      data={filteredData}
                      onAddRecord={handleAddRecord}
                      onEditRecord={handleEditRecord}
                      onDeleteRecord={handleDeleteRecord}
                      onDeleteSelectedRecords={handleDeleteSelectedRecords}
                      onApplyFilter={handleApplyFilter}
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <AnalyticsPage data={filteredData} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/excel-files"
                element={
                  <ProtectedRoute>
                    <ExcelFilesPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/*" element={<AppContent />} /> {/* Change from /dashboard/* to /* */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

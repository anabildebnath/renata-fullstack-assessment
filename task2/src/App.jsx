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
import rawData from "./data.json";
import "@/index.css";
import { FormModal } from "@/components/ui/form";
import { FilterPopup } from "@/components/filter-popup";
import { ProtectedRoute } from "@/components/ProtectedRoute"; // Import ProtectedRoute

function AppContent() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(() => {
    try {
      const savedData = localStorage.getItem("data");
      return savedData ? JSON.parse(savedData) : [];
    } catch (error) {
      console.error("Failed to load data from localStorage:", error);
      return [];
    }
  });

  const [filteredData, setFilteredData] = useState(data);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleUpdateData = (updatedData) => {
    setData(updatedData);
    setFilteredData(updatedData); // Update filtered data as well
    localStorage.setItem("data", JSON.stringify(updatedData));
  };

  const handleAddRecord = (newRecord) => {
    const updatedData = [
      ...data,
      { ...newRecord, addedAt: new Date().toISOString() }, // Add timestamp for every new record
    ];
    setData(updatedData);
    setFilteredData(updatedData); // Update filtered data as well
    localStorage.setItem("data", JSON.stringify(updatedData));
  };

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

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen bg-background text-foreground">
        <AppSidebar
          setIsFormOpen={setIsFormOpen}
          setIsFilterOpen={setIsFilterOpen}
        />
        <SidebarInset>
          <SiteHeader />
          <main className="flex flex-1 flex-col p-6">
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard data={filteredData} onUpdateData={handleUpdateData} />
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
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </SidebarInset>
      </div>
      <FormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddRecord} // Use handleAddRecord for adding new records
      />
      <FilterPopup
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilter={handleApplyFilter}
        onResetFilter={handleResetFilter}
      />
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard/*" element={<AppContent />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}

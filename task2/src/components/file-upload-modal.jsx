import React, { useState } from "react";
import { read, utils } from "xlsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function FileUploadModal({ isOpen, onClose, onUpload }) {
  const [file, setFile] = useState(null);

  const validateAndFormatData = (rawData) => {
    console.log("Raw data:", rawData);

    const validRows = rawData.filter((row) => {
      console.log("Processing row:", row);

      return (
        row["ID"] &&
        row["Customer Name"] &&
        row["Division"] &&
        row["Gender"] &&
        row["MaritalStatus"] &&
        row["Age"] !== undefined &&
        row["Income"] !== undefined
      );
    });

    console.log("Valid rows before formatting:", validRows);

    return validRows.map((row) => ({
      ID: String(row["ID"]),
      CustomerName: String(row["Customer Name"]),
      Division: String(row["Division"]),
      Gender: String(row["Gender"]),
      MaritalStatus: String(row["MaritalStatus"]),
      Age: parseInt(row["Age"]) || 0,
      Income: parseInt(row["Income"]) || 0,
      addedAt: new Date().toISOString(),
    }));
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const workbook = read(buffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const rawData = utils.sheet_to_json(worksheet, {
        raw: false,
        defval: "",
        blankrows: false,
        headers: true,
      });

      console.log("Raw Excel data:", rawData);

      if (rawData.length === 0) {
        throw new Error("No data found in the file");
      }

      const formattedData = validateAndFormatData(rawData);
      console.log("Formatted data:", formattedData);

      if (formattedData.length === 0) {
        throw new Error(
          "No valid records found after validation. Please check your file format."
        );
      }

      const uploadedFiles = JSON.parse(localStorage.getItem("uploadedFiles") || "[]");
      uploadedFiles.push({
        name: file.name,
        uploadedAt: new Date().toISOString(),
        size: file.size
      });
      localStorage.setItem("uploadedFiles", JSON.stringify(uploadedFiles));

      onUpload(formattedData);
      toast.success(`Successfully imported ${formattedData.length} records`);
      setFile(null);
      onClose();
    } catch (error) {
      console.error("File processing error:", error);
      toast.error(`Error processing file: ${error.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#0a0a0a] border border-[#252525] p-6">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-xl font-semibold text-white">Upload Customer Data</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="flex flex-col gap-4">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="block w-full text-sm text-white
                file:mr-4 file:py-2.5 file:px-4 
                file:rounded-md file:border-[1px] 
                file:border-[#3f3e3e] file:text-sm 
                file:font-medium file:bg-transparent 
                file:text-white hover:file:bg-[#2a2a31]
                file:cursor-pointer cursor-pointer"
            />
            <p className="text-sm text-gray-400">
              Upload an Excel file (.xlsx, .xls) with columns: ID, Customer Name, Division, Gender, MaritalStatus, Age, Income
            </p>
          </div>
          <div className="flex justify-end gap-4 mt-6 pt-4 border-t border-[#252525]">
            <Button variant="outline" onClick={onClose} 
              className="bg-transparent border-[#3f3e3e] text-white hover:bg-[#2a2a31]">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!file}
              className={`bg-primary text-white hover:bg-primary/90 ${!file ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Upload
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

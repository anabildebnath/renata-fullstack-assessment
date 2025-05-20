import React, { useState } from "react";
import { read, utils } from "xlsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function FileUploadModal({ isOpen, onClose, onUpload }) {
  const [file, setFile] = useState(null);

  const validateAndFormatData = (rawData) => {
    console.log("Raw data:", rawData);

    // Filter and validate rows without skipping any data rows
    const validRows = rawData.filter((row) => {
      console.log("Processing row:", row);

      // Check if required fields exist and are valid
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

    // Format the valid rows
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

      // Convert Excel data to JSON with headers option set to true
      const rawData = utils.sheet_to_json(worksheet, {
        raw: false,
        defval: "",
        blankrows: false,
        headers: true, // This ensures the first row is treated as headers
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

      // Save file metadata to localStorage
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
      <DialogContent className="sm:max-w-[425px] bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>Upload Customer Data</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
            <p className="text-sm text-muted-foreground">
              Upload an Excel file (.xlsx, .xls) with columns: ID, Customer Name, Division, Gender, MaritalStatus, Age, Income
            </p>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!file}
              className={!file ? "opacity-50 cursor-not-allowed" : ""}
            >
              Upload
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

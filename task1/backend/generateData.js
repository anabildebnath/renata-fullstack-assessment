// backend/generateData.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the existing data.json file
const dataFilePath = path.join(__dirname, '..', 'public', 'data.json');

// Helper to generate random product code
const randomProductName = () => {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  return Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
};

// Generate an array of new product data
const generateNewEntries = (count = 5) => {
  const newEntries = [];
  for (let i = 0; i < count; i++) {
    const product = randomProductName();
    const totalValue = Math.floor(Math.random() * 1000); // skewed value range
    const totalSales = Math.floor(Math.random() * 200);  // skewed sales count
    newEntries.push({ product, totalValue, totalSales });
  }
  return newEntries;
};

// Read existing data
let existingData = [];
try {
  const raw = fs.readFileSync(dataFilePath, 'utf8');
  existingData = JSON.parse(raw);
} catch {
  console.warn('⚠️ Could not read existing data.json. Creating new one...');
}

// Append new entries
const newEntries = generateNewEntries();
const updatedData = [...existingData, ...newEntries];

// Save back to file
fs.writeFileSync(dataFilePath, JSON.stringify(updatedData, null, 2));
console.log(`✅ Appended ${newEntries.length} new entries to data.json`);

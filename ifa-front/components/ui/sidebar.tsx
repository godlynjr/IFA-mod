"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import RedButton from "./Button";

// Define patient structure
interface Patient {
  id: string;
  name: string;
  lastName: string;
  gender: string;
  age: number;
  birthDate: string;
  height: number;
  weight: number;
  metrics: Record<string, any>;
}

// Predefined local JSON file paths
const jsonFiles = [
  "/data/response_VO2max.json",
  "/data/response_energy.json",
  "/data/response_oxygen.json",
  "/data/response_timeseries_forecasting.json",
  "/data/response_AI_scores.json",
  "/data/response_respiratory.json",
  "/data/heart.json",
];

const Sidebar: React.FC<{ onSelectPatient: (patient: Patient) => void }> = ({ onSelectPatient }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientLastName, setNewPatientLastName] = useState("");
  const [newPatientGender, setNewPatientGender] = useState("Male");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);

  // Load patients from localStorage on page load
  useEffect(() => {
    const storedPatients = localStorage.getItem("patients");
    if (storedPatients) {
      setPatients(JSON.parse(storedPatients));
    }
  }, []);

  // Save patients to localStorage whenever the list updates
  useEffect(() => {
    localStorage.setItem("patients", JSON.stringify(patients));
  }, [patients]);

  // Generate a random date of birth between 1930 and 2010
  const getRandomBirthDate = () => {
    const start = new Date(1930, 0, 1);
    const end = new Date(2010, 0, 1);
    const birthDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return birthDate.toISOString().split("T")[0]; // Format YYYY-MM-DD
  };

  // Fetch and parse all predefined JSON files
  const parseLocalFiles = async () => {
    try {
      const metrics: Record<string, any> = {};

      for (const filePath of jsonFiles) {
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Failed to load ${filePath}`);
        }

        const data = await response.json();
        const metricKey = filePath.split("/").pop()?.replace(".json", "") || "unknown_metric";
        metrics[metricKey] = data;
      }

      return metrics;
    } catch (err) {
      setError("Error loading patient data. Please check the JSON files.");
      return null;
    }
  };

  // Handle adding a new patient
  // const handleAddPatient = async () => {
  //   if (!newPatientName || !newPatientLastName) {
  //     setError("Please enter all patient details.");
  //     return;
  //   }

  //   setLoading(true);
  //   setError("");

  //   try {
  //     // Show "Accessing patient data..." for 7 seconds
  //     await new Promise((resolve) => setTimeout(resolve, 7000));

  //     const patientMetrics = await parseLocalFiles();
  //     if (!patientMetrics) return;

  //     const newPatient: Patient = {
  //       id: `${patients.length + 1}`,
  //       name: newPatientName,
  //       lastName: newPatientLastName,
  //       gender: newPatientGender,
  //       age: Math.floor(Math.random() * (90 - 18 + 1)) + 18, // Random age between 18 and 90
  //       birthDate: getRandomBirthDate(), // Random birth date
  //       height: Math.floor(Math.random() * (200 - 150 + 1)) + 150, // Random height between 150cm - 200cm
  //       weight: Math.floor(Math.random() * (100 - 50 + 1)) + 50, // Random weight between 50kg - 100kg
  //       metrics: patientMetrics,
  //     };

  //     setPatients([...patients, newPatient]);
  //     setShowAddPatientForm(false);
  //     setNewPatientName("");
  //     setNewPatientLastName("");
  //   } catch (error) {
  //     setError("Failed to add patient.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Handle adding a new patient
  const handleAddPatient = async () => {
    if (!newPatientName || !newPatientLastName) {
      setError("Please enter all patient details.");
      return;
    }

    if (!uploadFileName) {  // ✅ Check if a file has been uploaded
      setError("Please upload a file before saving the patient.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Show "Accessing patient data..." for 7 seconds
      await new Promise((resolve) => setTimeout(resolve, 7000));

      const patientMetrics = await parseLocalFiles();
      if (!patientMetrics) return;

      const newPatient: Patient = {
        id: `${patients.length + 1}`,
        name: newPatientName,
        lastName: newPatientLastName,
        gender: newPatientGender,
        age: Math.floor(Math.random() * (90 - 18 + 1)) + 18, // Random age between 18 and 90
        birthDate: getRandomBirthDate(), // Random birth date
        height: Math.floor(Math.random() * (200 - 150 + 1)) + 150, // Random height between 150cm - 200cm
        weight: Math.floor(Math.random() * (100 - 50 + 1)) + 50, // Random weight between 50kg - 100kg
        metrics: patientMetrics,
      };

      setPatients([...patients, newPatient]);
      setShowAddPatientForm(false);
      setNewPatientName("");
      setNewPatientLastName("");
      setUploadFileName(null); // ✅ Reset file input after successful save
    } catch (error) {
      setError("Failed to add patient.");
    } finally {
      setLoading(false);
    }
  };

  // Handle file upload (Cosmetic Only)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadFileName(file.name);
    }
  };

  return (
    <div className={`w-64 fixed top-0 left-0 h-screen bg-white flex flex-col border-r shadow-md z-10 ${loading ? "opacity-50 pointer-events-none" : ""}`}>
      {/* Sidebar content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Logo */}
        <div className="flex justify-center items-center mb-4">
          <Image src="/med-logo.png" alt="Logo" width={120} height={50} className="rounded-lg" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Patient Panel</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search patient..."
          className="p-2 mb-4 border rounded w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={loading}
        />

        {/* Add Patient Button */}
        <button className="w-full bg-red-500 text-white p-2 rounded mb-4 hover:bg-red-600 transition" onClick={() => setShowAddPatientForm(!showAddPatientForm)} disabled={loading}>
          Add New Patient
        </button>

        {/* New Patient Form */}
        {showAddPatientForm && (
          <div className="bg-gray-100 p-4 rounded shadow-md mb-4">
            <h3 className="text-lg font-semibold mb-2">Enter Patient Details</h3>
            <input type="text" placeholder="First Name" className="w-full p-2 mb-2 border rounded" value={newPatientName} onChange={(e) => setNewPatientName(e.target.value)} disabled={loading} />
            <input type="text" placeholder="Last Name" className="w-full p-2 mb-2 border rounded" value={newPatientLastName} onChange={(e) => setNewPatientLastName(e.target.value)} disabled={loading} />
            <select className="w-full p-2 mb-2 border rounded" value={newPatientGender} onChange={(e) => setNewPatientGender(e.target.value)} disabled={loading}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            {/* File Upload (Cosmetic) */}
            <input type="file" className="w-full p-2 mb-2 border rounded" accept=".json" onChange={handleFileUpload} disabled={loading} />
            {uploadFileName && <p className="text-xs text-gray-600">Uploaded: {uploadFileName}</p>}

            {/* Loading animation */}
            {loading && (
              <div className="flex flex-col items-center">
                <p className="text-blue-600 font-medium mt-2">Accessing patient data...</p>
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500 mx-auto mt-2"></div>
              </div>
            )}

            {/* Submit Button */}
            <RedButton
              text={loading ? "Processing..." : "Save Patient"}
              onClick={handleAddPatient}
              disabled={loading}
            />

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        )}

        {/* Patient List */}
        <h2 className="text-lg font-semibold mb-2">Patients</h2>
        <ul>
          {patients.map((patient) => (
            <li key={patient.id} onClick={() => onSelectPatient(patient)} className="p-2 cursor-pointer rounded hover:bg-gray-100 transition">
              {patient.name} {patient.lastName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;

"use client";

import React from "react";

interface Patient {
  name?: string;
  lastName?: string;
  birthDate?: string;
  gender?: string;
  height?: string;
  weight?: string;
}

interface PatientOverviewProps {
  patient: Patient | null;
}

import RedButton from "./ui/Button";

const PatientOverview: React.FC<PatientOverviewProps> = ({ patient }) => {
  // Helper function to return "N/A" for empty or missing values
  const getValue = (value?: string) => (value && value.trim() !== "" ? value : "N/A");

  if (!patient) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md w-full text-gray-500 text-center">
        <p>Select a patient from the sidebar to view details.</p>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-lg w-full flex justify-between items-start">
      {/* Patient Details (Left Side) */}
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">Patient Overview</h2>

        {/* Row 1: Name, Last Name, Birthdate */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Name</p>
            <p className="text-lg font-semibold">{getValue(patient.name)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Last Name</p>
            <p className="text-lg font-semibold">{getValue(patient.lastName)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Birth Date</p>
            <p className="text-lg font-semibold">{getValue(patient.birthDate)}</p>
          </div>
        </div>

        {/* Row 2: Gender, Height, Weight */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Gender</p>
            <p className="text-lg font-semibold">{getValue(patient.gender)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Height (cm)</p>
            <p className="text-lg font-semibold">{getValue(patient.height)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Weight (kg)</p>
            <p className="text-lg font-semibold">{getValue(patient.weight)}</p>
          </div>
        </div>
      </div>

      {/* AI Insights Button (Right Side) */}
      <RedButton text="AI INSIGHTS" />
    </div>
  );
};

export default PatientOverview;

"use client";

import React, { useState } from "react";
import RedButton from "./ui/Button";
import InsightsSection from "./InsightsSection";
import { motion } from "framer-motion";

interface Patient {
  id: string;
  name: string;
  lastName: string;
  gender: string;
  birthDate: string;
  height: number;
  weight: number;
  metrics: Record<string, any>;
}

interface PatientOverviewProps {
  patient: Patient | null;
}

// Helper function to return "N/A" for missing values
const getValue = (value?: string | number) => (value !== undefined && value !== "" ? value : "N/A");

const PatientOverview: React.FC<PatientOverviewProps> = ({ patient }) => {
  const [showInsights, setShowInsights] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Handle AI Insights Button Click
  const handleShowInsights = () => {
    setLoadingInsights(true);
    setShowInsights(false); // Hide previous insights while loading

    setTimeout(() => {
      setLoadingInsights(false);
      setShowInsights(true);
    }, 3000); // Simulates loading for 3 seconds
  };

  // If no patient is selected
  if (!patient) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md w-full text-gray-500 text-center">
        <p>Select a patient from the sidebar to view details.</p>
      </div>
    );
  }

  return (
    <>
      {/* Patient Overview Section */}
      <div className="p-6 rounded-lg w-full flex justify-between items-start relative">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Patient Overview</h2>

          {/* Grid Layout - 2 Rows, 3 Columns */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600">Name</p>
              <p className="text-lg font-semibold text-gray-900">{getValue(patient.name)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Last Name</p>
              <p className="text-lg font-semibold text-gray-900">{getValue(patient.lastName)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Gender</p>
              <p className="text-lg font-semibold text-gray-900">{getValue(patient.gender)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Birth Date</p>
              <p className="text-lg font-semibold text-gray-900">{getValue(patient.birthDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Height (cm)</p>
              <p className="text-lg font-semibold text-gray-900">{getValue(patient.height)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Weight (kg)</p>
              <p className="text-lg font-semibold text-gray-900">{getValue(patient.weight)}</p>
            </div>
          </div>
        </div>

        {/* AI Insights Button */}
        <div className="flex items-center">
          <RedButton text="AI INSIGHTS" onClick={handleShowInsights} />
        </div>
      </div>

      {/* Full-Screen Loading Animation */}
      {loadingInsights && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-95 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="text-center text-gray-800 text-xl font-semibold"
            animate={{ opacity: [0, 1, 0], transition: { duration: 1.5, repeat: Infinity } }}
          >
            Loading Insights...
          </motion.div>
        </motion.div>
      )}

      {/* Insights Section (Appears Below After Clicking Button) */}
      {showInsights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-10 mb-10"
        >
          <InsightsSection patient={patient} />
        </motion.div>
      )}
    </>
  );
};

export default PatientOverview;

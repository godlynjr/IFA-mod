"use client";

import React from "react";
import { motion } from "framer-motion";

interface HealthMetricsGridProps {
  patient: any | null;
  timeframe: string;
}

const metrics = [
  { title: "Avg Heart Rate", value: "72", unit: "bpm" },
  { title: "BPM", value: "85", unit: "bpm" },
  { title: "Step Count", value: "12,345", unit: "steps" },
  { title: "Time in Bed", value: "7h 30m" },
  { title: "Running Speed", value: "8.5", unit: "km/h" },
  { title: "Time In Daylight", value: "+34%" },
  { title: "Respiratory Rate", value: "16", unit: "breaths/min" },
  { title: "Apple Exercise Time", value: "45m" },
  { title: "Flights Climbed", value: "12" },
  { title: "Oxygen Saturation", value: "98%", trend: "+2%" },
  { title: "Calories Burned", value: "2,100", unit: "kcal" },
  { title: "Blood Pressure", value: "120/80" },
];

// Animation settings
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const HealthMetricsGrid: React.FC<HealthMetricsGridProps> = ({ patient, timeframe  }) => {
  if (!patient) {
    return (
      <div className="text-left text-gray-500 text-lg mt-10">
        {/* Select a patient to view health metrics. */}
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-6"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {metrics.map((metric, index) => (
        <motion.div
          key={index}
          whileHover={{
            scale: 1.05,
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="transition-all bg-white shadow-md rounded-xl h-28 w-full p-4 flex flex-col justify-between"
        >
          {/* Title */}
          <p className="text-gray-500 text-sm">{metric.title}</p>

          {/* Value & Unit (Left-Aligned) */}
          <div className="flex items-baseline">
            <span className="text-2xl font-bold">{metric.value}</span>
            {metric.unit && (
              <span className="text-gray-400 text-lg ml-1">{metric.unit}</span>
            )}
          </div>

          {/* Optional Trend (if available) */}
          {metric.trend && (
            <span className="text-red-500 text-sm font-semibold">{metric.trend}</span>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default HealthMetricsGrid;

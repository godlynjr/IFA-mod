"use client";

import React from "react";
import { motion } from "framer-motion";

interface Patient {
  id: string;
  name: string;
  lastName: string;
  gender: string;
  birthDate: string;
  height: number;
  weight: number;
  metrics: Record<string, any>; // Contains all parsed metrics
}

interface HealthMetricsGridProps {
  patient: Patient | null;
  timeframe: string; // New: Timeframe selection
}

// Define the required metrics
const metricSources = [
  { key: "heart", title: "Avg Heart Rate", unit: "bpm" },
  { key: "response_VO2max", title: "VO2 Max", unit: "ml/kg/min" },
  { key: "response_respiratory", title: "Respiratory Rate", unit: "breaths/min" },
  { key: "response_oxygen", title: "Oxygen SPO2", unit: "%" },
  { key: "response_energy", title: "Calories Burned", unit: "kcal" },
  { key: "response_timeseries_forecasting", title: "Time Series Forecasting", unit: "" },
];

// Function to round numbers to 2 decimal places
const roundValue = (num: any): string => {
  if (typeof num === "number") return num.toFixed(2); // Convert to string with 2 decimals
  return "N/A";
};

// Animation settings
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const HealthMetricsGrid: React.FC<HealthMetricsGridProps> = ({ patient, timeframe }) => {
  if (!patient) {
    return (
      <div className="text-left text-gray-500 text-lg mt-10">
        Select a patient to view health metrics.
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 p-6"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {metricSources.map((metric, index) => {
        // Safely extract metric data for the selected timeframe
        const metricData = patient.metrics[metric.key] || {};
        let value = "N/A"; // Default to "N/A"
        let trend = "N/A"; // Default to "N/A"

        if (timeframe === "Daily") {
          const lastDailyData = metricData?.data?.daily_avg?.slice(-1)[0]; // Get the last available daily data
          value = lastDailyData ? roundValue(lastDailyData.daily_avg) : "N/A";
          trend = lastDailyData ? `${roundValue(lastDailyData.evolution)}%` : "N/A";
        } else if (timeframe === "Weekly") {
          const lastWeeklyData = metricData?.data?.weekly_avg?.slice(-1)[0]; // Get the last available weekly data
          value = lastWeeklyData ? roundValue(lastWeeklyData.weekly_avg) : "N/A";
          trend = lastWeeklyData ? `${roundValue(lastWeeklyData.evolution)}%` : "N/A";
        } else if (timeframe === "Yearly") {
          const lastMonthlyData = metricData?.data?.monthly_avg?.slice(-1)[0]; // Get the last available monthly data
          value = lastMonthlyData ? roundValue(lastMonthlyData.monthly_avg) : "N/A";
          trend = lastMonthlyData ? `${roundValue(lastMonthlyData.evolution)}%` : "N/A";
        } else {
          // Default to overall average
          value = metricData?.data?.overall_avg !== undefined ? roundValue(metricData.data.overall_avg) : "N/A";
          trend = metricData?.data?.overall_avg_ev !== undefined ? `${roundValue(metricData.data.overall_avg_ev)}%` : "N/A";
        }

        return (
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

            {/* Value & Unit */}
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">{value}</span>
              {metric.unit && <span className="text-gray-400 text-lg ml-1">{metric.unit}</span>}
            </div>

            {/* Trend Percentage (if available) */}
            {trend !== "N/A" && (
              <span className={`text-sm font-semibold ${Number(trend.replace("%", "")) > 0 ? "text-green-500" : "text-red-500"}`}>
                {trend}
              </span>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default HealthMetricsGrid;

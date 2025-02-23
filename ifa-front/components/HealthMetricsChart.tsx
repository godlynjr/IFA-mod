"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

interface HealthMetricsChartProps {
  patient: Patient | null;
  timeframe: string;
}

// Function to extract chart data from patient metrics
const getChartData = (patient: Patient | null, timeframe: string) => {
  if (!patient) return [];

  let metricKey = "";
  let valueKey = ""; // This ensures correct data extraction

  switch (timeframe) {
    case "Daily":
      metricKey = "daily_avg";
      valueKey = "daily_avg";
      break;
    case "Weekly":
      metricKey = "weekly_avg";
      valueKey = "weekly_avg";
      break;
    case "Yearly":
      metricKey = "monthly_avg";
      valueKey = "monthly_avg";
      break;
    default:
      return [];
  }

  const metricData = patient.metrics.heart?.data?.[metricKey] ?? [];

  return metricData.map((entry: any) => ({
    value: parseFloat(entry[valueKey]?.toFixed(2) || "0"),
  }));
};

// Custom Tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded-md shadow-md text-gray-700 text-sm">
        <p className="text-lg font-bold">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const HealthMetricsChart: React.FC<HealthMetricsChartProps> = ({ patient, timeframe }) => {
  if (!patient) {
    return (
      <div className="text-center text-gray-500 text-lg mt-10">
        Select a patient to view activity trends.
      </div>
    );
  }

  const data = getChartData(patient, timeframe);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-lg font-semibold mb-2">Heart Rate Trends ({timeframe})</h2>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={data}
          onMouseMove={(e) => setHoveredIndex(e.activeTooltipIndex ?? null)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Tooltip */}
          <Tooltip content={<CustomTooltip />} />

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF3B3B" stopOpacity={1} />
              <stop offset="100%" stopColor="#FF3B3B" stopOpacity={0.2} />
            </linearGradient>
          </defs>

          {/* Line with Gradient */}
          <Line
            type="monotone"
            dataKey="value"
            stroke="url(#chartGradient)"
            strokeWidth={3}
            dot={(props) => {
              const { cx, cy, index } = props;
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={hoveredIndex === index ? 6 : 0}
                  fill={hoveredIndex === index ? "#00C49F" : "transparent"}
                />
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HealthMetricsChart;

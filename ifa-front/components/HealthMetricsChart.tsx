"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface HealthMetricsChartProps {
  patient: any | null;
  timeframe: string;
}

// Sample Data Generator for Different Timeframes
const getDataForTimeframe = (timeframe: string) => {
  switch (timeframe) {
    case "Daily":
      return [
        { time: "12 AM", value: 60 },
        { time: "6 AM", value: 70 },
        { time: "12 PM", value: 90 },
        { time: "6 PM", value: 85 },
        { time: "11 PM", value: 75 },
      ];
    case "Weekly":
      return [
        { day: "Mon", value: 100 },
        { day: "Tue", value: 150 },
        { day: "Wed", value: 130 },
        { day: "Thu", value: 170 },
        { day: "Fri", value: 200 },
        { day: "Sat", value: 220 },
        { day: "Sun", value: 190 },
      ];
    case "Yearly":
      return [
        { month: "JAN", value: 50 },
        { month: "FEB", value: 80 },
        { month: "MAR", value: 120 },
        { month: "APR", value: 90 },
        { month: "MAY", value: 200 },
        { month: "JUN", value: 350 },
        { month: "JUL", value: 180 },
        { month: "AUG", value: 210 },
        { month: "SEP", value: 230 },
        { month: "OCT", value: 250 },
        { month: "NOV", value: 300 },
        { month: "DEC", value: 400 },
      ];
    case "Live":
      return [
        { time: "10:00 AM", value: 100 },
        { time: "10:05 AM", value: 102 },
        { time: "10:10 AM", value: 105 },
        { time: "10:15 AM", value: 98 },
        { time: "10:20 AM", value: 110 },
      ];
    default:
      return [];
  }
};

// Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded-md shadow-md text-gray-700 text-sm">
        <p className="font-semibold">{label}</p>
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
        {/* Select a patient to view activity trends. */}
      </div>
    );
  }

  const data = getDataForTimeframe(timeframe);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-lg font-semibold mb-2">Activity ({timeframe})</h2>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={data}
          onMouseMove={(e) => setHoveredIndex(e.activeTooltipIndex ?? null)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Background Grid */}
          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          {/* X and Y Axis */}
          <XAxis
            dataKey={timeframe === "Yearly" ? "month" : timeframe === "Weekly" ? "day" : "time"}
            tick={{ fill: "#999" }}
          />
          <YAxis tick={{ fill: "#999" }} />

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
            dot={(props) =>
              hoveredIndex === props.index ? (
                <circle cx={props.cx} cy={props.cy} r={6} fill="#00C49F" />
              ) : null
            } // Show dot only on hover
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HealthMetricsChart;

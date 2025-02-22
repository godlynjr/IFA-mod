import React from "react";

interface HealthMetricProps {
  title: string;
  value: string;
  unit?: string;
  trend?: string;
}

const HealthMetric: React.FC<HealthMetricProps> = ({ title, value, unit, trend }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md w-full flex flex-col items-start">
      {/* Title */}
      <p className="text-gray-500 text-sm">{title}</p>

      {/* Value + Unit */}
      <div className="flex items-baseline">
        <span className="text-2xl font-bold">{value}</span>
        {unit && <span className="text-gray-400 text-lg">/{unit}</span>}
      </div>

      {/* Optional Trend (e.g., +34%) */}
      {trend && <span className="text-red-500 text-lg font-semibold">{trend}</span>}
    </div>
  );
};

export default HealthMetric;

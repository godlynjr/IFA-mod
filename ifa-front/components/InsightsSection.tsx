"use client";

import React, { useState, useEffect } from "react";
import RedButton from "./ui/Button";

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

interface InsightsSectionProps {
  patient: Patient | null;
}

// Function to generate insights dynamically based on metrics
const generateInsights = (patient: Patient | null) => {
  if (!patient) return ["No patient selected. Please choose a patient to see insights."];

  const insights = [];
  const metrics = patient.metrics;

  // Ensure metrics exist before extracting values
  const heartRate = metrics.heart?.data?.overall_avg;
  const heartRateTrend = metrics.heart?.data?.overall_avg_ev;
  const stepCount = metrics.response_timeseries_forecasting?.data?.overall_avg;
  const stepCountTrend = metrics.response_timeseries_forecasting?.data?.overall_avg_ev;
  const oxygenSaturation = metrics.response_oxygen?.data?.overall_avg;
  const oxygenTrend = metrics.response_oxygen?.data?.overall_avg_ev;
  const caloriesBurned = metrics.response_energy?.data?.overall_avg;
  const caloriesTrend = metrics.response_energy?.data?.overall_avg_ev;
  const vo2Max = metrics.response_VO2max?.data?.overall_avg;
  const respiratoryRate = metrics.response_respiratory?.data?.overall_avg;

  // Dynamic Insights Based on Data
  if (heartRate) {
    insights.push(
      `Your average heart rate is ${heartRate.toFixed(2)} bpm. ${
        heartRateTrend > 0
          ? `It has increased by ${heartRateTrend.toFixed(2)}%.`
          : heartRateTrend < 0
          ? `It has decreased by ${Math.abs(heartRateTrend).toFixed(2)}%.`
          : `It remains stable.`
      }`
    );
  }

  if (stepCount) {
    insights.push(
      `Your daily step count is around ${Math.round(stepCount)} steps. ${
        stepCountTrend > 0
          ? `You are walking ${stepCountTrend.toFixed(2)}% more than before.`
          : stepCountTrend < 0
          ? `You are walking ${Math.abs(stepCountTrend).toFixed(2)}% less than before.`
          : `It remains stable.`
      }`
    );
  }

  if (oxygenSaturation) {
    insights.push(
      `Your oxygen saturation is at ${oxygenSaturation.toFixed(2)}%. ${
        oxygenTrend > 0
          ? `It has improved by ${oxygenTrend.toFixed(2)}%.`
          : oxygenTrend < 0
          ? `It has decreased by ${Math.abs(oxygenTrend).toFixed(2)}%. Consider checking with a doctor.`
          : `It remains stable.`
      }`
    );
  }

  if (caloriesBurned) {
    insights.push(
      `You are burning an average of ${Math.round(caloriesBurned)} kcal per day. ${
        caloriesTrend > 0
          ? `Your energy expenditure has increased by ${caloriesTrend.toFixed(2)}%.`
          : caloriesTrend < 0
          ? `Your energy expenditure has decreased by ${Math.abs(caloriesTrend).toFixed(2)}%.`
          : `It remains stable.`
      }`
    );
  }

  if (vo2Max) {
    insights.push(`Your VO2 Max (oxygen efficiency) is ${vo2Max.toFixed(2)} ml/kg/min.`);
  }

  if (respiratoryRate) {
    insights.push(`Your respiratory rate is ${respiratoryRate.toFixed(2)} breaths/min.`);
  }

  return insights.length ? insights : ["No available insights for this patient."];
};

const InsightsSection: React.FC<InsightsSectionProps> = ({ patient }) => {
  const [chatMessages, setChatMessages] = useState<{ user: string; ai: string }[]>([]);
  const [userInput, setUserInput] = useState("");
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    setInsights(generateInsights(patient));
  }, [patient]);

  // Handle AI Chat Responses (Mocked)
  const handleChatSubmit = () => {
    if (!userInput.trim()) return;

    const userMessage = userInput;
    setUserInput("");

    // Simulate AI Response
    setTimeout(() => {
      const aiResponse = `Based on your insights, "${userMessage}" might indicate a normal trend, but please consult a doctor for accuracy.`;
      setChatMessages([...chatMessages, { user: userMessage, ai: aiResponse }]);
    }, 1000);
  };

  return (
    <div className="mt-10 mb-10 bg-white p-6 shadow-lg rounded-lg flex flex-col md:flex-row gap-6">
      {/* Insights Section */}
      <div className="flex-1">
        <h2 className="text-2xl font-semibold mb-4">Insights</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          {insights.map((insight, index) => (
            <li key={index}>{insight}</li>
          ))}
        </ul>
      </div>

      {/* AI Chat Section */}
      <div className="w-full md:w-1/3 bg-gray-50 p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-2">Ask AI About Your Insights</h3>
        <div className="h-40 overflow-y-auto border p-2 bg-white rounded mb-2">
          {chatMessages.length === 0 && (
            <p className="text-gray-500 text-sm">Ask any question about your health trends.</p>
          )}
          {chatMessages.map((msg, index) => (
            <div key={index} className="mb-3">
              <p className="text-blue-600 font-semibold">You: {msg.user}</p>
              <p className="text-gray-700">AI: {msg.ai}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded focus:outline-none"
            placeholder="Type your question..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleChatSubmit()}
          />
          <RedButton text="Ask" onClick={handleChatSubmit} />
        </div>
      </div>
    </div>
  );
};

export default InsightsSection;

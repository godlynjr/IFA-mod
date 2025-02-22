"use client";

import React, { useState } from "react";
import RedButton from "./ui/Button";

interface InsightsSectionProps {
  patient: any;
}

const InsightsSection: React.FC<InsightsSectionProps> = ({ patient }) => {
  const [chatMessages, setChatMessages] = useState<{ user: string; ai: string }[]>([]);
  const [userInput, setUserInput] = useState("");

  // Example Insights
  const insights = [
    "Your average heart rate this week is stable at 72 bpm.",
    "Step count has increased by 15% compared to last month.",
    "You spent 30% less time in daylight than recommended.",
    "Your oxygen saturation is within a healthy range (98%).",
    "Your exercise activity is consistent with last month's trends.",
  ];

  // Handle AI Chat Responses (Mocked)
  const handleChatSubmit = () => {
    if (!userInput.trim()) return;

    const userMessage = userInput;
    setUserInput("");

    // Simulate AI Response (You can replace this with a real AI API call)
    setTimeout(() => {
      const aiResponse = `Based on your insights, ${userMessage} might indicate a normal trend, but please consult a doctor for accuracy.`;
      setChatMessages([...chatMessages, { user: userMessage, ai: aiResponse }]);
    }, 1000);
  };

  return (
    <div className="mt-10 bg-white p-6 shadow-lg rounded-lg flex flex-col md:flex-row gap-6">
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
          {/* <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            onClick={handleChatSubmit}
          >
            Ask
          </button> */}
          <RedButton text="Ask" onClick={handleChatSubmit} />
        </div>
      </div>
    </div>
  );
};

export default InsightsSection;

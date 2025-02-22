"use client";

import React from "react";
import Image from "next/image";

interface Patient {
  id: string;
  name: string;
  lastName: string;
  birthDate: string;
  gender: string;
  height: string;
  weight: string;
}

interface SidebarProps {
  onSelectPatient: (patient: Patient) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelectPatient }) => {
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const [sortBy, setSortBy] = React.useState<string>("name");
  const [showUploadForm, setShowUploadForm] = React.useState<boolean>(false);

  // Sample patients (replace with API data if needed)
  const patients: Patient[] = [
    {
      id: "1",
      name: "John",
      lastName: "Doe",
      birthDate: "1985-06-15",
      gender: "Male",
      height: "180",
      weight: "75",
    },
    {
      id: "2",
      name: "Jane",
      lastName: "Smith",
      birthDate: "1992-09-23",
      gender: "Female",
      height: "165",
      weight: "60",
    },
    {
      id: "3",
      name: "Alice",
      lastName: "Johnson",
      birthDate: "1978-04-12",
      gender: "Female",
      height: "170",
      weight: "65",
    },
  ];

  // Doctor's details
  const doctor = {
    name: "Dr. Anderson",
    email: "james.anderson@hospital.com",
    image: "/doctor-profile.jpg", // Ensure this image exists in /public
  };

  // Handle file upload (Mock function)
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      alert(`File uploaded: ${file.name}`); // Replace with actual file processing logic
      setShowUploadForm(false);
    }
  };

  return (
    <div className="w-64 fixed top-0 left-0 h-screen bg-white flex flex-col border-r shadow-md z-10">
      {/* Scrollable Content: Takes full height minus the footer */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Logo */}
        <div className="flex justify-center items-center mb-4">
          <Image src="/med-logo.png" alt="Logo" width={120} height={50} className="rounded-lg" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Patient Panel</h2>

        {/* Sort By Dropdown */}
        <label className="text-sm text-gray-600">Sort by:</label>
        <select
          className="w-full p-2 mb-4 border rounded-lg"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="lastName">Last Name</option>
          <option value="age">Age</option>
          <option value="gender">Gender</option>
        </select>

        {/* Search Bar */}
        <label className="text-sm text-gray-600">Search patient:</label>
        <input
          type="text"
          placeholder="Type a name..."
          className="p-2 mb-4 border rounded focus:outline-none w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* New Patient Upload Button */}
        <button
          className="w-full bg-red-500 text-white p-2 rounded mb-4 hover:bg-white hover:text-red-700 hover:border hover:border-red-700 transition"
          onClick={() => setShowUploadForm(!showUploadForm)}
        >
          New Patient
        </button>

        {/* File Upload Form */}
        {showUploadForm && (
          <div className="bg-gray-100 p-4 rounded shadow-md mb-4">
            <h3 className="text-lg font-semibold mb-2">Upload Patient File</h3>
            <input
              type="file"
              className="w-full p-2 mb-2 border rounded"
              accept=".json,.csv,.pdf"
              onChange={handleFileUpload}
            />
            <p className="text-xs text-gray-600">Supported format: JSON, CSV, PDF</p>
          </div>
        )}

        {/* Patient List */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Patients</h2>
          <ul>
            {patients
              .filter((patient) =>
                `${patient.name} ${patient.lastName}`
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase())
              )
              .map((patient) => (
                <li
                  key={patient.id}
                  onClick={() => onSelectPatient(patient)}
                  className="p-2 cursor-pointer rounded hover:bg-gray-100 transition"
                >
                  {patient.name} {patient.lastName}
                </li>
              ))}
          </ul>
        </div>
      </div>

      {/* Doctor Info Section (Stays at Bottom) */}
      <div className="p-4 border-t bg-gray-50 flex items-center gap-3">
        <Image
          src={doctor.image}
          alt="Doctor Profile"
          width={50}
          height={50}
          className="rounded-full border"
        />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-800">{doctor.name}</span>
          <span className="text-xs text-gray-600">{doctor.email}</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

import React, { useState } from "react";
import { Eye } from "lucide-react";

interface GatePassRecord {
  id: string;
  type: "INWARD" | "OUTWARD";
  date: string;
  station: string;
  purpose: string;
  initiatedBy: string;
  status: string;
}

const GatePassTables: React.FC = () => {
  const [activeTab, setActiveTab] = useState("All");

  const data: GatePassRecord[] = [
    {
      id: "OGP/MLR/2025-26/001",
      type: "OUTWARD",
      date: "29/10/2025",
      station: "Mangalore",
      purpose: "Machinery for maintenance",
      initiatedBy: "Sanjay Singh",
      status: "PENDING APPROVAL",
    },
    {
      id: "IGP/MLR/2025-26/0002",
      type: "INWARD",
      date: "29/10/2025",
      station: "Neriya",
      purpose: "Equipment return",
      initiatedBy: "Adarsh Jha",
      status: "PENDING APPROVAL",
    },
    {
      id: "OGP/MLR/2025-26/0002",
      type: "OUTWARD",
      date: "29/10/2025",
      station: "Hassan",
      purpose: "Machinery for maintenance",
      initiatedBy: "K Anish",
      status: "PENDING APPROVAL",
    },
    {
      id: "IGP/MLR/2025-26/0002",
      type: "INWARD",
      date: "29/10/2025",
      station: "Devangonthi",
      purpose: "Export shipment",
      initiatedBy: "Ramesh Jain",
      status: "PENDING APPROVAL",
    },
  ];

  const tabs = [
    "Entry Passes",
    "Outward Passes",
    "Inward Passes",
    "Returnable Tracker",
    "All",
  ];

  return (
    <div className="mt-8 py-0 bg-white rounded-xl shadow-sm p-3">
      {/* Tabs */}
      <div className="flex flex-wrap justify-between items-center mb-4 border-b pb-2">
        <div className="flex flex-wrap gap-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-medium ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button className="text-sm text-blue-600 font-medium hover:underline">
          View All
        </button>
      </div>

      {/* ✅ Scrollable Table with Sticky Header */}
      <div className="overflow-x-auto">
        <div className="max-h-[40vh] overflow-y-auto rounded-md pb-8"> {/* ✅ Added extra bottom padding */}
          <table className="min-w-full text-sm border-collapse">
            <thead className="sticky top-0 z-10 bg-gray-100 shadow-sm">
              <tr className="text-gray-700">
                <th className="p-3 text-left">Gate pass no.</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Station</th>
                <th className="p-3 text-left">Purpose</th>
                <th className="p-3 text-left">Initiated By</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((record, i) => (
                <tr
                  key={i}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 font-medium text-gray-900">{record.id}</td>
                  <td className="p-3">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        record.type === "INWARD"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {record.type}
                    </span>
                  </td>
                  <td className="p-3">{record.date}</td>
                  <td className="p-3">{record.station}</td>
                  <td className="p-3">{record.purpose}</td>
                  <td className="p-3">{record.initiatedBy}</td>
                  <td className="p-3">
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                      {record.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2 items-center">
                    <Eye size={16} className="text-gray-600" />
                    <button className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded hover:bg-blue-700">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ Bottom spacer ensures last row fully visible */}
          <div className="h-10" />
        </div>
      </div>
    </div>
  );
};

export default GatePassTables;

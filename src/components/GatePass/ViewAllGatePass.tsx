import React, { useEffect, useState } from "react";
import { GATEPASS_HEADER_DATA } from "@/utils/data";
import { useNavigate } from "react-router-dom";
import api from "@/api/axiosInstance";
import { Search, FileUp } from "lucide-react";
import MocTopHeader from "../moc/MocTopHeader";
import GPFilterDD from "../GatePass/GPFilterDD";
import GPTypeFilter from "./GPTypeFilter";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import GPBasicTable from "../tables/GPBasicTable";

// Interface for filters
interface MocFilters {
  created_by: string;
  moc_request_no: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface GatePassRow {
  gate_pass_no: string;
  formtype: string;
  status: string;
  date_time: string;
  station: string;
  purpose: string;
  created_by: string;
}

const ViewAllGatePass = () => {
  const navigate = useNavigate();

  // UI States
  const [tableData, setTableData] = useState<GatePassRow[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("Outward Passes");
  const [loading, setLoading] = useState(false);

  // Filters
  const [activeFilters, setActiveFilters] = useState<MocFilters>({
    created_by: "",
    moc_request_no: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  // Read userId once
  const storedUser = localStorage.getItem("userData");
  const userId = storedUser ? JSON.parse(storedUser)?.userId : null;

  // ---------- 📌 API MAP (No switch-case needed) ----------
  const API_MAP: Record<string, string> = {
    "All": `/api/GatePass/other/user/${userId}`,
    "Inward Passes": `/api/GatePass/IG/IGgetall/${userId}`,
    "Returnable Tracker": `/api/GatePass/GetReturnable/${userId}`,
    "Outward Passes": `/api/GatePass/OG/GetAllOutwardGatePass/${userId}`,
  };

  // ---------- 📌 FORMATTER MAP (Shapes vary by API) ----------
  const formatRecord = (item: any) => ({
    gate_pass_no: item.gate_pass_no ?? "-",
    formtype: item.formtype ?? "-",
    status: item.status ?? "-",
    date_time:
      item.date_time
        ? new Date(item.date_time).toLocaleString("en-IN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "-",
    station: item.station ?? "-",
    purpose: item.purpose ?? "-",
    created_by: item.created_by ?? "-",
  });

  // ---------- 📌 Fetch Function ----------
  const fetchGatePassData = async () => {
  if (!userId) return;

  try {
    setLoading(true);
    const endpoint = API_MAP[selectedTab];
    const res = await api.get(endpoint);

    let rawData: any[] = [];

    // ---------- 📌 1. Extract raw records depending on tab ----------
    switch (selectedTab) {

      case "All":
        const main = res.data?.data || {};
        rawData = [
          ...(main.inward || []),
          ...(main.outward || []),
          ...(main.returnable || []),
        ];
        break;

      case "Outward Passes":
        rawData = res.data?.data || [];
        break;

      default:
        rawData = res.data || [];
        break;
    }

    // ---------- 📌 2. Format all records ----------
    const formattedRows = rawData.map((item) => formatRecord(item));

    // ---------- 📌 3. Store in table ----------
    setTableData(formattedRows);

  } catch (error) {
    console.error("API fetch failed:", error);
  } finally {
    setLoading(false);
  }
};

  // ---------- 📌 Single useEffect (Runs only when tab changes) ----------
  useEffect(() => {
    fetchGatePassData();
  }, [selectedTab]);

  // ---------- 📌 Export Excel ----------
  const handleExport = () => {
    if (!tableData.length) {
      alert("No data available to export.");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(tableData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GatePassData");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, `GatePassData_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // ---------- 📌 View Action ----------
  const handleClickViewAction = (row: GatePassRow) => {
    navigate(`/station-operations/${encodeURIComponent(row.gate_pass_no)}`);
  };

  return (
    <div className="flex flex-col h-screen overflow-visible">
      {/* Header */}
      <div className="rounded-md mb-2 mt-2">
        <MocTopHeader
          title="All Gate Passes"
          subTitle="View, print, and manage all gate passes"
        />
      </div>

      {/* Search + Filter + Export */}
      <div className="flex items-center justify-between mb-2">
        {/* Search */}
        <div className="w-1/2 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID, name, vehicle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-1 pl-10 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Filters + Export */}
        <div className="flex items-center gap-3 ml-auto">
          <GPFilterDD
            onStationSelect={() => {}}
            onApplyFilter={(filters) => setActiveFilters(filters)}
            mocData={tableData}
          />

          <button
            onClick={handleExport}
            className="flex items-center gap-2 border bg-white px-4 py-2 rounded-lg text-xs shadow-sm hover:bg-gray-100"
          >
            <FileUp size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <GPTypeFilter onTabSelect={(t) => setSelectedTab(t)} />

      {/* Table */}
      <div className="flex-1 overflow-x-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">Loading...</div>
        ) : (
          <GPBasicTable
              tableHeader={GATEPASS_HEADER_DATA}
              tableData={tableData}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleClickViewAction={handleClickViewAction as unknown as (row: any) => void}
              showAddButton={false}
              maxHeight="none" 
              currentPage={0} 
              itemsPerPage={0} />
        )}
      </div>

      {/* Close Button */}
      <div className="flex justify-end mt-1 pr-4 pb-16 mb-2">
        <button
          onClick={() => navigate(-1)}
          className="border border-gray-400 px-5 py-2 text-xs rounded-lg shadow-sm hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewAllGatePass;







// import React, { use, useEffect, useState } from "react";
// import { GATEPASS_HEADER_DATA } from "@/utils/data";
// import { useNavigate } from "react-router-dom";
// import api from "@/api/axiosInstance";
// import { Search } from "lucide-react";
// import MocTopHeader from "../moc/MocTopHeader";
// import GPFilterDD from "../GatePass/GPFilterDD";
// import { FileUp } from "lucide-react";
// import GPTypeFilter from "./GPTypeFilter";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import GPBasicTable from "../tables/GPBasicTable";

// // Interface for advanced filters to ensure type safety
// interface MocFilters {
//   created_by: string;
//   moc_request_no: string;
//   status: string;
//   startDate: string;
//   endDate: string;
// }

// interface GatePassRow {
//   gate_pass_no: string;
//   type: string;
//   status: string;
//   date: string;
//   station_name: string;
//   purpose: string;
//   created_by: string;
// }

// const ViewAllGatePass = () => {
//   const navigate = useNavigate();
//   const [tableData, setTableData] = useState<GatePassRow[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedStation, setSelectedStation] = useState<string>("");
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(1000);
//   const [triggerFilter, setTriggerFilter] = useState(0); 

//   const handleExport = () => {
//   try {
//     if (!currentItems || currentItems.length === 0) {
//       alert("No data available to export.");
//       return;
//     }
//     const worksheet = XLSX.utils.json_to_sheet(currentItems);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Gate Pass Data");
//     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
//     saveAs(blob, `GatePassData_${new Date().toISOString().slice(0, 10)}.xlsx`);
//   } catch (error) {
//     console.error("Export failed:", error);
//   }
// };

//   // 💡 NEW STATE FOR ADVANCED FILTERS
//   const [activeFilters, setActiveFilters] = useState<MocFilters>({
//     created_by: "",
//     moc_request_no: "",
//     status: "",
//     startDate: "",
//     endDate: "",
//   });
  
//     const fetchGatePassData = async (tab: string) => {
//       try {
//         setLoading(true);

//         const storedUser = localStorage.getItem("userData");
//         const parsedUser = storedUser ? JSON.parse(storedUser) : null;
//         const userId = parsedUser?.userId;

//         let endpoint = "";

//         switch (tab) {
//           case "All":
//             endpoint = `/api/GatePass/other/user/${userId}`;
//             break;
//           case "Inward Passes":
//             endpoint = `/api/GatePass/IG/IGgetall/${userId}`;
//             break;
//           case "Returnable Tracker":
//             endpoint = `/api/GatePass/GetReturnable/${userId}`;
//             break;
//           case "Outward Passes":
//             endpoint = `/api/GatePass/OG/GetAllOutwardGatePass/${userId}`;
//             break;
//           default:
//             return;
//         }

//         const res = await api.get(endpoint);
//         console.log("response", res.data);
        
//         let records = [];
//        // Handle different response formats
//         if (tab === "Outward Passes") {
//           records = res.data?.data || []; 
//         } else {
//           records = res.data || []; 
//         }
//         const formatted = records.map((item: any, idx: number) => ({
//           gate_pass_no: item.gate_pass_no ?? "-",
//           type: item.type ?? "-",   
//           status: item.status ?? "-",
//           // convert T date → "2025-01-15 10:30 AM"
//           date_time: item.date_time
//             ? new Date(item.date_time).toLocaleString("en-IN", {
//                 year: "numeric",
//                 month: "2-digit",
//                 day: "2-digit",
//                 hour: "2-digit",
//                 minute: "2-digit",
//                 hour12: true,
//               })
//             : "-",  

//           station: item.station ?? "-", 
//           purpose: item.purpose ?? "-",
//           created_by: item.created_by ?? "-",
//           action: "",
//         }));


//         setTableData(formatted);
//       } catch (error) {
//         console.error("API fetch failed:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
 
//    useEffect(() => {
//     fetchGatePassData("Outward Passes");
//   }, []);
  

//   const handleClickViewAction = (row: GatePassRow) => {
//   navigate(`/station-operations/${encodeURIComponent(row.gate_pass_no)}`)
//   };
//   const handleClickEditAction = (infoSelectedRow: Record<string, any>) => {};


//    const handleTabChange = (selectedTab: string) => {
//     console.log("Selected tab:", selectedTab);
//     fetchGatePassData(selectedTab);  };

//    const currentItems = tableData.map((item, idx) => ({
//     ...item,
//     serialNumber: idx + 1,
//   }));

//   return (
//     <div className="flex flex-col h-screen overflow-visible">
//       <div className="rounded-md mb-2 mt-2">
//         <MocTopHeader
//           title="All Gate Passes"
//           subTitle="View, print, and manage all gate passes"
//         />
//       </div>

//       <div className="flex items-center justify-between mb-2">
//         {/* Search bar (left aligned) */}
//         <div className="w-1/2 relative">
//             <Search
//             className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
//             />
//             <input
//             type="text"
//             placeholder="Search by ID, name, vehicle..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full px-4 py-1 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//         </div>

//         {/* Right-aligned section (Filter + Export side by side) */}
//         <div className="flex items-center gap-3 ml-auto">
//             <GPFilterDD
//             onStationSelect={setSelectedStation}
//             onApplyFilter={(filters) => {
//                 setActiveFilters(filters);
//                 setTriggerFilter(prev => prev + 1);
//             }}
//             mocData={tableData}
//             />

//             <button
//             onClick={handleExport}
//             className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-xs shadow-sm transition"
//             >
//             <FileUp size={16} />
//             Export
//             </button>
//         </div>
//         </div>
//       <div >
//         <GPTypeFilter onTabSelect={handleTabChange} />
//       </div>


//       {/* Table Section */}
//       <div className="flex-1 overflow-x-hidden ">
//         {loading ? (
//           <div className="flex items-center justify-center h-full">
//             <div>Loading...</div>
//           </div>
//         ) : (
//           <GPBasicTable
//             tableHeader={GATEPASS_HEADER_DATA}
//             tableData={currentItems as any}
//             handleClickEditAction={handleClickEditAction}
//             handleClickViewAction={handleClickViewAction as unknown as (row: any) => void}
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//             currentPage={currentPage}
//             itemsPerPage={itemsPerPage}
//             showAddButton={false}
//             maxHeight="none"
//           />
//         )}
//       </div>
//       <div className="flex justify-end mt-1 pr-4 pb-16 mb-2">
//         <button
//           onClick={() => navigate(-1)} // go back to previous page
//           className="border border-gray-400 hover:bg-gray-300 text-gray-800 text-xs px-5 py-2 rounded-lg shadow-sm transition"
//         >
//           Close
//         </button>
//       </div>

//     </div>
//   );
// };

// export default ViewAllGatePass;











//ORIGINAL
// import React, { useEffect, useState } from "react";
// import { GATEPASS_HEADER_DATA } from "@/utils/data";
// import { useNavigate } from "react-router-dom";
// import api from "@/api/axiosInstance";
// import { Search } from "lucide-react";
// import MocTopHeader from "../moc/MocTopHeader";
// import GPFilterDD from "../GatePass/GPFilterDD";
// import { FileUp } from "lucide-react";
// import GPTypeFilter from "./GPTypeFilter";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import GPBasicTable from "../tables/GPBasicTable";

// // Interface for advanced filters to ensure type safety
// interface MocFilters {
//   created_by: string;
//   moc_request_no: string;
//   status: string;
//   startDate: string;
//   endDate: string;
// }

// interface IMOCTableRow {
//   slNo: number;
//   moc_request_no: string;
//   title: string;
//   station_name: string;
//   created_by: string;
//   date: string;
//   status: string;
//   action: string;
// }

// const ViewAllGatePass = () => {
//   const [tableData, setTableData] = useState<IMOCTableRow[]>([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedStation, setSelectedStation] = useState<string>("");
//   const [selectedDays, setSelectedDays] = useState<number | null>(null);
//   const [modal, setModal] = useState(false);
//   const [modalDelete, setModalDelete] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(1000);
  
//   const handleExport = () => {
//   try {
//     if (!currentItems || currentItems.length === 0) {
//       alert("No data available to export.");
//       return;
//     }

//     // Convert visible table data to worksheet
//     const worksheet = XLSX.utils.json_to_sheet(currentItems);

//     // Create a workbook
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Gate Pass Data");

//     // Generate Excel file
//     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

//     // Trigger file download
//     saveAs(blob, `GatePassData_${new Date().toISOString().slice(0, 10)}.xlsx`);
//   } catch (error) {
//     console.error("Export failed:", error);
//   }
// };



//   // 💡 NEW STATE FOR ADVANCED FILTERS
//   const [activeFilters, setActiveFilters] = useState<MocFilters>({
//     created_by: "",
//     moc_request_no: "",
//     status: "",
//     startDate: "",
//     endDate: "",
//   });
  
//   // State to force the filter logic to re-run when 'Apply Filter' is clicked
//   const [triggerFilter, setTriggerFilter] = useState(0); 

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchMocData = async () => {
//       try {
//         setLoading(true);
//         const storedUser = localStorage.getItem("userData");
//         const parsedUser = storedUser ? JSON.parse(storedUser) : null;
//         const userId = parsedUser?.userId;

//         const res = await api.get(`/api/MOC/GetByUser/${userId}`);
//         const records = res.data?.data?.data || [];

//         if (Array.isArray(records)) {
//           const formatted = records.map((item: any, idx: number) => ({
//             slNo: idx + 1,
//             moc_request_no: item.moc_request_no || "-",
//             title: item.title || "-",
//             station_name: item.station_name || "-",
//             created_by: item.created_by || "-",
//             date: item.date?.split("T")[0] || "", 
//             status: item.status || "-",
//             action: "",
//             mocClosure: "",
//           }));
//           setTableData(formatted);
//         } else {
//           console.error("⚠️ Invalid MOC data:", res.data);
//         }
//       } catch (error) {
//         console.error("🚨 Failed to fetch MOC table data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMocData();
//   }, []);

//   const handleClickViewAction = (row: IMOCTableRow) => {
//   navigate(`/station-operations/${encodeURIComponent(row.moc_request_no)}`)
//   };
//   const handleDeleteAction = (row: IMOCTableRow) => console.log("Delete:", row);
//   const handleClickEditAction = (infoSelectedRow: Record<string, any>) => {};


//    const handleTabChange = (selectedTab: string) => {
//     console.log("Selected tab:", selectedTab);
//     // You can trigger filter logic here
//   };
//   // Use all filtered data (no pagination)
//    const currentItems = tableData.map((item, idx) => ({
//     ...item,
//     serialNumber: idx + 1,
//   }));

//   return (
//     <div className="flex flex-col h-screen overflow-visible">
//       <div className="rounded-md mb-2 mt-2">
//         <MocTopHeader
//           title="All Gate Passes"
//           subTitle="View, print, and manage all gate passes"
//         />
//       </div>

//       <div className="flex items-center justify-between mb-2">
//         {/* Search bar (left aligned) */}
//         <div className="w-1/2 relative">
//             <Search
//             className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
//             />
//             <input
//             type="text"
//             placeholder="Search by ID, name, vehicle..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full px-4 py-1 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//             />
//         </div>

//         {/* Right-aligned section (Filter + Export side by side) */}
//         <div className="flex items-center gap-3 ml-auto">
//             <GPFilterDD
//             onStationSelect={setSelectedStation}
//             onApplyFilter={(filters) => {
//                 setActiveFilters(filters);
//                 setTriggerFilter(prev => prev + 1);
//             }}
//             mocData={tableData}
//             />

//             <button
//             onClick={handleExport}
//             className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 rounded-lg px-4 py-2 text-xs shadow-sm transition"
//             >
//             <FileUp size={16} />
//             Export
//             </button>
//         </div>
//         </div>
//       <div >
//         <GPTypeFilter onTabSelect={handleTabChange} />
//       </div>


//       {/* Table Section */}
//       <div className="flex-1 overflow-x-hidden ">
//         {loading ? (
//           <div className="flex items-center justify-center h-full">
//             <div>Loading...</div>
//           </div>
//         ) : (
//           <GPBasicTable
//             tableHeader={GATEPASS_HEADER_DATA}
//             tableData={currentItems as any}
//             handleClickEditAction={handleClickEditAction}
//             handleClickViewAction={handleClickViewAction as unknown as (row: any) => void}
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//             currentPage={currentPage}
//             itemsPerPage={itemsPerPage}
//             showAddButton={false}
//             maxHeight="none"
//           />
//         )}
//       </div>
//       <div className="flex justify-end mt-1 pr-4 pb-16 mb-2">
//         <button
//           onClick={() => navigate(-1)} // go back to previous page
//           className="border border-gray-400 hover:bg-gray-300 text-gray-800 text-xs px-5 py-2 rounded-lg shadow-sm transition"
//         >
//           Close
//         </button>
//       </div>

//     </div>
//   );
// };

// export default ViewAllGatePass;


import React, { useState, useEffect } from "react";
import GatePassTopHeader from "./GatePassTopHeader";
import InwardOutward from "./InwardOutward";
import { AlertBanner, GatePassCardProps, GatePassCardsGrid } from "./GatePassCards";
import GPBasicTable from "../tables/GPBasicTable";
import { GATEPASS_HEADER_DATA } from "@/utils/data";
import { useNavigate } from "react-router-dom";
import api from "@/api/axiosInstance";
import GPTypeFilter from "./GPTypeFilter";

interface GatePassRow {
  gate_pass_no: string;
  formtype: string;
  status: string;
  date_time: string;
  station: string;
  purpose: string;
  created_by: string;
}

const GatePassDashboard: React.FC = () => {
  const [tableData, setTableData] = useState<GatePassRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Outward Passes");
  const [searchQuery, setSearchQuery] = useState("");
  const handleCardClick = (cardTitle: string) => alert(`${cardTitle} clicked!`);
  const navigate = useNavigate();
  const handleClickEditAction = (infoSelectedRow: Record<string, any>) => {};
  const handleClickViewAction = (row: GatePassRow) => {
    navigate(`/station-operations/${encodeURIComponent(row.gate_pass_no)}`)
  };
  const storedUser = localStorage.getItem("userData");
  const userId = storedUser ? JSON.parse(storedUser)?.userId : null;
  
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

  // ---------- Hardcoded Summary Cards ----------
  const cardData: GatePassCardProps[] = [
    { title: "Total Gate Passes ", count: 24, subtitle: "All types combined", icon: "gate", variant: "default", onClick: () => handleCardClick("Total Gate Passes Today") },
    { title: "Pending Approvals", count: 5, subtitle: "Awaiting Review", icon: "pending", variant: "default", onClick: () => handleCardClick("Pending Approvals") },
    { title: "Returnable Pending", count: 8, subtitle: "Items not returned", icon: "returnable", variant: "default", onClick: () => handleCardClick("Returnable Pending") },
    { title: "Total Inward Passes", count: 142, subtitle: "All time", icon: "inward", variant: "highlighted", onClick: () => handleCardClick("Total Inward Passes") },
    { title: "Total Entries", count: 246, subtitle: "Today's entries", icon: "entries", variant: "default", onClick: () => handleCardClick("Total Entries") },
    { title: "Total Outward Passes", count: 128, subtitle: "All time", icon: "outward", variant: "default", onClick: () => handleCardClick("Total Outward Passes") },
  ];

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* ---------- Fixed Header (Sticky) ---------- */}
      <div className="sticky top-0 z-50 mb-2 mt-1 ml-1 rounded-md">
        <GatePassTopHeader
          title="Gate Pass Management System"
          subTitle="PMHBL - Professional Material Handling"
        />
      </div>

      {/* ---------- Static Content (Non-scrollable) ---------- */}
      <div className="px-1 space-y-3 flex-shrink-0 mt-4">
        {/* <AlertBanner pendingCount={5} onReviewClick={handleReviewClick} /> */}
        <GatePassCardsGrid cards={cardData} />
        {/* <InwardOutward /> */}
      </div>

      {/* ----------Type Filter ---------- */}
      <div className="flex items-center justify-between p-1">
       <div className=" mt-2 flex-shrink-0">
        <GPTypeFilter onTabSelect={(t) => setSelectedTab(t)} />
      </div>
        <button
        className="flex items-center gap-1 whitespace-nowrap rounded-lg border border-primary bg-white px-3 py-2 mr-5 text-xs font-medium text-primary shadow-sm transition hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary shadow-[#010810]"
        onClick={() => navigate("/station-operations/gate-pass/viewAll")}
      >
        View All
      </button>
      </div>

      {/* ---------- Scrollable Table Section ---------- */}
      <div className="flex-1 overflow-hidden pb-14">
        {loading ? (
          <div className="flex items-center justify-center h-full ">
            <div>Loading...</div>
          </div>
        ) : (
          <GPBasicTable
            tableHeader={GATEPASS_HEADER_DATA}
            tableData={tableData}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            handleClickViewAction={handleClickViewAction as unknown as (row: any) => void}
            showAddButton={false}
            currentPage={0} 
            itemsPerPage={0} 
          />
        )}
      </div>
    </div>
  );
};

export default GatePassDashboard;







// import React, { useState, useEffect } from "react";
// import GatePassTopHeader from "./GatePassTopHeader";
// import InwardOutward from "./InwardOutward";
// import { AlertBanner, GatePassCardProps, GatePassCardsGrid } from "./GatePassCards";
// import GPBasicTable from "../tables/GPBasicTable";
// import { GATEPASS_HEADER_DATA } from "@/utils/data";
// import { useNavigate } from "react-router-dom";
// import api from "@/api/axiosInstance";
// import GPTypeFilter from "./GPTypeFilter";

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

// const GatePassDashboard: React.FC = () => {
//   const [tableData, setTableData] = useState<IMOCTableRow[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [searchQuery, setSearchQuery] = useState("");
//   const handleCardClick = (cardTitle: string) => alert(`${cardTitle} clicked!`);
//   const navigate = useNavigate();
//   const handleClickEditAction = (infoSelectedRow: Record<string, any>) => {};
//   const handleClickViewAction = (row: IMOCTableRow) => {
//     navigate(`/station-operations/${encodeURIComponent(row.moc_request_no)}`)
//   };
//   const handleTabChange = (selectedTab: string) => {
//     console.log("Selected tab:", selectedTab);
//     // You can trigger filter logic here
//   };
//   // Fetch data on component mount
//   useEffect(() => {
//     const fetchGatePassData = async () => {
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
//           }));
//           setTableData(formatted);
//         }
//       } catch (error) {
//         console.error("Failed to fetch gate pass data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchGatePassData();
//   }, []);

//   // Create currentItems from tableData
//   const currentItems = tableData.map((item, idx) => ({
//     ...item,
//     serialNumber: idx + 1,
//   }));

//   // ---------- Hardcoded Summary Cards ----------
//   const cardData: GatePassCardProps[] = [
//     { title: "Total Gate Passes ", count: 24, subtitle: "All types combined", icon: "gate", variant: "default", onClick: () => handleCardClick("Total Gate Passes Today") },
//     { title: "Pending Approvals", count: 5, subtitle: "Awaiting Review", icon: "pending", variant: "default", onClick: () => handleCardClick("Pending Approvals") },
//     { title: "Returnable Pending", count: 8, subtitle: "Items not returned", icon: "returnable", variant: "default", onClick: () => handleCardClick("Returnable Pending") },
//     { title: "Total Inward Passes", count: 142, subtitle: "All time", icon: "inward", variant: "highlighted", onClick: () => handleCardClick("Total Inward Passes") },
//     { title: "Total Entries", count: 246, subtitle: "Today's entries", icon: "entries", variant: "default", onClick: () => handleCardClick("Total Entries") },
//     { title: "Total Outward Passes", count: 128, subtitle: "All time", icon: "outward", variant: "default", onClick: () => handleCardClick("Total Outward Passes") },
//   ];

//   return (
//     <div className="h-screen bg-gray-50 flex flex-col">
//       {/* ---------- Fixed Header (Sticky) ---------- */}
//       <div className="sticky top-0 z-50 mb-2 mt-1 ml-1 rounded-md">
//         <GatePassTopHeader
//           title="Gate Pass Management System"
//           subTitle="PMHBL - Professional Material Handling"
//         />
//       </div>

//       {/* ---------- Static Content (Non-scrollable) ---------- */}
//       <div className="px-1 space-y-3 flex-shrink-0 mt-4">
//         {/* <AlertBanner pendingCount={5} onReviewClick={handleReviewClick} /> */}
//         <GatePassCardsGrid cards={cardData} />
//         {/* <InwardOutward /> */}
//       </div>

//       {/* ----------Type Filter ---------- */}
//       <div className="flex items-center justify-between p-1">
//        <div className=" mt-2 flex-shrink-0">
//         <GPTypeFilter onTabSelect={handleTabChange} />
//       </div>
//         <button
//         className="flex items-center gap-1 whitespace-nowrap rounded-lg border border-primary bg-white px-3 py-2 mr-5 text-xs font-medium text-primary shadow-sm transition hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary shadow-[#010810]"
//         onClick={() => navigate("/station-operations/gate-pass/viewAll")}
//       >
//         View All
//       </button>
//       </div>

//       {/* ---------- Scrollable Table Section ---------- */}
//       <div className="flex-1 overflow-hidden pb-14">
//         {loading ? (
//           <div className="flex items-center justify-center h-full ">
//             <div>Loading...</div>
//           </div>
//         ) : (
//           <GPBasicTable
//             tableHeader={GATEPASS_HEADER_DATA}
//             tableData={currentItems as any}
//             handleClickEditAction={handleClickEditAction}
//             handleClickViewAction={handleClickViewAction as unknown as (row: any) => void}
//             currentPage={currentPage}
//             itemsPerPage={itemsPerPage}
//             searchQuery={searchQuery}
//             setSearchQuery={setSearchQuery}
//             showAddButton={false}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default GatePassDashboard;
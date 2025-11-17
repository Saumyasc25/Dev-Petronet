import React from "react";
import { LogIn, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate

interface GatePassCardProps {
  type: "inward" | "outward";
  title: string;
  description: string;
  onCreate: () => void;
}

const GatePassCard: React.FC<GatePassCardProps> = ({
  type,
  title,
  description,
  onCreate,
}) => {
  const icon =
    type === "inward" ? (
      <LogIn className="text-gray-600" size={20} />
    ) : (
      <LogOut className="text-gray-600" size={20} />
    );

  return (
    <div className="w-full md:w-[48%] bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-gray-900 font-semibold text-lg">{title}</h2>
          <p className="text-gray-500 text-sm mt-1 leading-snug">{description}</p>
        </div>
        <div className="bg-gray-100 rounded-md p-2">{icon}</div>
      </div>

         <button
        onClick={onCreate}
        className="mt-4 w-full border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-1 rounded-md transition text-sm"
      >
        {type === "inward" ? "Create Inward Pass" : "Create Outward Pass"}
      </button>
    </div>
  );
};

const InwardOutward: React.FC = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate

  // Navigation Handlers
  const handleCreateInward = () => {
    navigate("/station-operations/moc/inward-pass"); // 🧭 Change this route to your actual inward page path
  };

  const handleCreateOutward = () => {
    navigate("/station-operations/moc/outward-pass"); // 🧭 Change this route to your actual outward page path
  };

  return (
    <div className=" w-full py-0 flex flex-col md:flex-row gap-8 justify-between p-0  -mt-4 relative z-10  ">
      {/* <div className="w-full  h-[45px] rounded-lg border border-yellow-300 bg-yellow-50 p-4 py-3 flex items-center justify-between -mt-4 relative z-10"> */}
      <GatePassCard
        type="inward"
        title="Inward Gate Pass"
        description="Material coming into premises. 
        Record materials entering the facility. Track PO/Non-PO 
        items and partial deliveries."
        onCreate={handleCreateInward}
      />

      <GatePassCard
        type="outward"
        title="Outward Gate Pass"
        description="Material going out of premises. Create gate pass for materials leaving the facility. Must be approved by Initiator and Reviewer."
        onCreate={handleCreateOutward}
      />
    </div>
  );
};

export default InwardOutward;










// import React from "react";
// import { ArrowRightLeft, LogIn, LogOut } from "lucide-react";

// interface GatePassCardProps {
//   type: "inward" | "outward";
//   title: string;
//   description: string;
//   onCreate: () => void;
// }

// const GatePassCard: React.FC<GatePassCardProps> = ({
//   type,
//   title,
//   description,
//   onCreate,
// }) => {
//   const icon =
//     type === "inward" ? (
//       <LogIn className="text-gray-600" size={20} />
//     ) : (
//       <LogOut className="text-gray-600" size={20} />
//     );

//   return (
//     <div
//       className="w-full md:w-[48%] bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition-all duration-200"
//     >
//       <div className="flex items-start justify-between">
//         <div>
//           <h2 className="text-gray-900 font-semibold text-lg">{title}</h2>
//           <p className="text-gray-500 text-sm mt-1 leading-snug">{description}</p>
//         </div>
//         <div className="bg-gray-100 rounded-md p-2">{icon}</div>
//       </div>

//       <button
//         onClick={onCreate}
//         className="mt-4 w-full border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-2 rounded-lg transition"
//       >
//         {type === "inward" ? "Create Inward Pass" : "Create Outward Pass"}
//       </button>
//     </div>
//   );
// };

// interface InwardOutwardProps {
//   onCreateInward: () => void;
//   onCreateOutward: () => void;
// }

// const InwardOutward: React.FC<InwardOutwardProps> = ({
//   onCreateInward,
//   onCreateOutward,
// }) => {
//   return (
//     // <div className="flex flex-col md:flex-row gap-4 justify-between w-full">
//     //   <GatePassCard
//     //     type="inward"
//     //     title="Inward Gate Pass"
//     //     description="Material coming into premises. 
//     //     Record materials entering the facility. Track PO/Non-PO 
//     //     items and partial deliveries."
//     //     onCreate={onCreateInward}
//     //   />

//     //   <GatePassCard
//     //     type="outward"
//     //     title="Outward Gate Pass"
//     //     description="Material going out of premises. Create gate pass for materials leaving the facility. Must be approved by Initiator and Reviewer."
//     //     onCreate={onCreateOutward}
//     //   />
//     // </div>




//     // <div className="flex flex-col md:flex-row gap-4 justify-between w-full py-0">
//         <div className="flex flex-col md:flex-row gap-4 justify-between w-full">
//       <GatePassCard
//         type="inward"
//         title="Inward Gate Pass"
//         description="Material coming into premises. 
//         Record materials entering the facility. Track PO/Non-PO 
//         items and partial deliveries."
//         onCreate={onCreateInward}
//       />

//       <GatePassCard
//         type="outward"
//         title="Outward Gate Pass"
//         description="Material going out of premises. Create gate pass for materials leaving the facility. Must be approved by Initiator and Reviewer."
//         onCreate={onCreateOutward}
//       />
//     </div>






















//   );
// };

// export default InwardOutward;







// import React from "react";
// import { ArrowRightToLine, ArrowLeftToLine } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// interface InwardOutwardProps {
//   onInwardClick?: () => void;
//   onOutwardClick?: () => void;
// }

// const InwardOutward: React.FC<InwardOutwardProps> = ({
//   onInwardClick,
//   onOutwardClick,
// }) => {
//   const cards = [
//     {
//       type: "inward",
//       title: "Inward Gate Pass",
//       description:
//         "Record materials entering the facility. Track PO/Non-PO items and partial deliveries.",
//       buttonText: "Create Inward Pass",
//       icon: <ArrowRightToLine size={18} />,
//       onClick: onInwardClick,
//     },
//     {
//       type: "outward",
//       title: "Outward Gate Pass",
//       description:
//         "Create gate pass for materials leaving the facility. Must be approved by Initiator and Reviewer.",
//       buttonText: "Create Outward Pass",
//       icon: <ArrowLeftToLine size={18} />,
//       onClick: onOutwardClick,
//     },
//   ];

//   return (
//     <div className="flex flex-col md:flex-row gap-6 w-full">
//       {cards.map((card) => (
//         <Card
//           key={card.type}
//           className={`flex flex-col justify-between border rounded-2xl p-6 hover:shadow-md transition ${
//             card.type === "inward" ? "border-blue-400" : "border-gray-300"
//           } flex-1`}
//         >
//           <div className="flex justify-between items-start mb-4">
//             <div>
//               <h3 className="text-lg font-semibold">{card.title}</h3>
//               <p className="text-sm text-gray-600 mt-1">{card.description}</p>
//             </div>
//             <div
//               className={`p-2 rounded-lg ${
//                 card.type === "inward"
//                   ? "bg-blue-100 text-blue-600"
//                   : "bg-gray-100 text-gray-600"
//               }`}
//             >
//               {card.icon}
//             </div>
//           </div>

//           <CardContent className="p-0">
//             <Button
//               onClick={card.onClick}
//               className={`w-full mt-4 ${
//                 card.type === "inward"
//                   ? "bg-blue-500 hover:bg-blue-600"
//                   : "bg-gray-700 hover:bg-gray-800"
//               } text-white`}
//             >
//               {card.buttonText}
//             </Button>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// };

// export default InwardOutward;

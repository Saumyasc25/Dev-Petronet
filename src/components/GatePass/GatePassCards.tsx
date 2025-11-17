import React from 'react';
import { FileText, Clock, RotateCcw, ArrowRight, ClipboardList, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface GatePassCardProps {
  title: string;
  count: number;
  subtitle: string;
  icon?: 'gate' | 'pending' | 'returnable' | 'inward' | 'entries' | 'outward';
  variant?: 'default' | 'highlighted';
  onClick?: () => void;
}

const iconMap = {
  gate: FileText,
  pending: Clock,
  returnable: RotateCcw,
  inward: ArrowRight,
  entries: ClipboardList,
  outward: ArrowLeft,
};

export const GatePassCard: React.FC<GatePassCardProps> = ({
  title,
  count,
  subtitle,
  icon = 'gate',
  variant = 'default',
  onClick,
}) => {
  const Icon = iconMap[icon];

  
  return (
    <div
      onClick={onClick}
      className={`
        relative w-full h-[80px] rounded-xl py-0 border cursor-pointer
        transition-all duration-200 hover:scale-105 hover:shadow-lg
        ${variant === 'highlighted' 
          ? 'bg-white border-2 border-blue-500 shadow-[2px_2px_2px_0px_rgba(0,0,0,0.1)]' 
          : 'bg-white border border-blue-500/50 shadow-[2px_2px_2px_0px_rgba(0,0,0,0.1)]'
        }
      `}
    >
      <div className="flex flex-col h-full p-1 py-1 justify-between">
        <div className="flex items-start justify-between">
          <h3 className="text-xs sm:text-sm font-medium text-gray-700 leading-tight pr-2">
            {title}
          </h3>
          <Icon className="w-5 h-5 text-gray-400 flex-shrink-0" />
        </div>
        
        <div className="flex flex-col gap-1">
          <p className="text-3xl sm:text-2xl font-bold text-gray-900">
            {count}
          </p>
          <p className="text-xs text-gray-500">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export interface AlertBannerProps {
  pendingCount: number;
  onReviewClick?: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ 
  pendingCount, 
  onReviewClick 
}) => {
   const navigate = useNavigate(); // ✅ FIXED: initialize navigate
  return (
    // <div className="w-full rounded-lg border border-yellow-300 bg-yellow-50 p-4 flex items-center justify-between">
      <div className="w-full  h-[45px] rounded-lg border border-yellow-300 bg-yellow-50 p-4 py-3 flex items-center justify-between -mt-4 relative z-10">
     {/* <div className="relative border-yellow-300 bg-yellow-50 px-6 py-3 flex items-center justify-between rounded-md shadow-md" style={{ width: "100%" }} > */}
     
      <div className="flex items-center gap-3 ">
        <FileText className="w-5 h-5 text-yellow-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-gray-900">
            {pendingCount} gate pass(es) pending approval
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            Review and approve pending gate passes
          </p>
        </div>
      </div>
      <button
        // onClick={onReviewClick}
        onClick={() => navigate("/station-operations/moc/notifications")}   // ✅ navigate on click to diffenerent route
        className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
      >
        Review Now
      </button>
    </div>
  );
};

export interface GatePassCardsGridProps {
  cards: GatePassCardProps[];
}

export const GatePassCardsGrid: React.FC<GatePassCardsGridProps> = ({ cards }) => {
  return (
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 w-full  ">
    {/* <div className="w-full rounded-lg border border-yellow-300 bg-yellow-50 p-4 py-3 flex items-center justify-between -mt-4 relative z-10"> */}

      {cards.map((card, index) => (
        <GatePassCard key={index} {...card} />
      ))}
    </div>
  );
};




// import React from 'react';
// import { FileText, Clock, RotateCcw, ArrowRight, ClipboardList, ArrowLeft } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// export interface GatePassCardProps {
//   title: string;
//   count: number;
//   subtitle: string;
//   icon?: 'gate' | 'pending' | 'returnable' | 'inward' | 'entries' | 'outward';
//   variant?: 'default' | 'highlighted';
//   onClick?: () => void;
// }

// const iconMap = {
//   gate: FileText,
//   pending: Clock,
//   returnable: RotateCcw,
//   inward: ArrowRight,
//   entries: ClipboardList,
//   outward: ArrowLeft,
// };

// export const GatePassCard: React.FC<GatePassCardProps> = ({
//   title,
//   count,
//   subtitle,
//   icon = 'gate',
//   variant = 'default',
//   onClick,
// }) => {
//   const Icon = iconMap[icon];

//   return (
//     <div
//       onClick={onClick}
//       className={`
//         relative w-full h-[115px] rounded-xl border cursor-pointer
//         transition-all duration-200 hover:scale-105 hover:shadow-lg
//         ${variant === 'highlighted' 
//           ? 'bg-white border-2 border-blue-500 shadow-[2px_2px_2px_0px_rgba(0,0,0,0.1)]' 
//           : 'bg-white border border-blue-500/50 shadow-[2px_2px_2px_0px_rgba(0,0,0,0.1)]'
//         }
//       `}
//     >
//       <div className="flex flex-col h-full p-4 justify-between">
//         <div className="flex items-start justify-between">
//           <h3 className="text-xs sm:text-sm font-medium text-gray-700 leading-tight pr-2">
//             {title}
//           </h3>
//           <Icon className="w-5 h-5 text-gray-400 flex-shrink-0" />
//         </div>

//         <div className="flex flex-col gap-1">
//           <p className="text-3xl sm:text-4xl font-bold text-gray-900">
//             {count}
//           </p>
//           <p className="text-xs text-gray-500">
//             {subtitle}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export interface AlertBannerProps {
//   pendingCount: number;
//   onReviewClick?: () => void;
// }

// export const AlertBanner: React.FC<AlertBannerProps> = ({ 
//   pendingCount, 
//   onReviewClick 
// }) => {
//   const navigate = useNavigate(); // ✅ FIXED: initialize navigate

//   return (
//     <div className="w-full rounded-lg border border-yellow-300 bg-yellow-50 p-4 flex items-center justify-between">
//       <div className="flex items-center gap-3">
//         <FileText className="w-5 h-5 text-yellow-600 flex-shrink-0" />
//         <div>
//           <p className="text-sm font-medium text-gray-900">
//             {pendingCount} gate pass(es) pending approval
//           </p>
//           <p className="text-xs text-gray-600 mt-0.5">
//             Review and approve pending gate passes
//           </p>
//         </div>
//       </div>
//       <button
//         onClick={onReviewClick || (() => navigate("/station-operations/moc/notifications"))}
//         className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
//       >
//         Review Now
//       </button>
//     </div>
//   );
// };

// export interface GatePassCardsGridProps {
//   cards: GatePassCardProps[];
// }

// export const GatePassCardsGrid: React.FC<GatePassCardsGridProps> = ({ cards }) => {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 w-full">
//       {cards.map((card, index) => (
//         <GatePassCard key={index} {...card} />
//       ))}
//     </div>
//   );
// };

import React from 'react'

interface GatePassTopHeaderProps {
  title: string
  subTitle?: string
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onAddClick?: () => void
  showAddButton?: boolean
  addButtonLabel?: string
  rightContent?: React.ReactNode
}

const GatePassTopHeader: React.FC<GatePassTopHeaderProps> = ({
  title,
  subTitle,
  // searchQuery,
  // onSearchChange,
  // onAddClick,
  // showAddButton = true,
  // addButtonLabel,
  // rightContent,
}) => {
  return (
    <div
      className="relative bg-[#1E6FBF] px-6 py-3 flex items-center justify-between rounded-md shadow-md"
      style={{ width: "100%" }}
    >
      <h1 className="text-white text-xl font-semibold">
        {title}
        {subTitle && <span className="text-sm font-normal block">{subTitle}</span>}
      </h1>
      {/* {showAddButton && onAddClick && (
        <button
          className="flex items-center gap-1 whitespace-nowrap rounded-md bg-white px-2 py-2 text-sm font-medium text-blue-600 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
          onClick={onAddClick}
        > 
          <Plus className="h-4 w-4" />
          {addButtonLabel || 'New MoC Request'}
        </button>
      )} */}
    </div>
  )
}

export default GatePassTopHeader











// import { Plus, Bell } from 'lucide-react'
// import React from 'react'

// interface GatePassTopHeaderProps {
//   title: string
//   subTitle?: string
//   searchQuery?: string
//   onSearchChange?: (query: string) => void
//   onAddClick?: () => void
//   showAddButton?: boolean
//   addButtonLabel?: string
//   rightContent?: React.ReactNode
//   notificationCount?: number
//   onNotificationClick?: () => void
// }

// const GatePassTopHeader: React.FC<GatePassTopHeaderProps> = ({
//   title,
//   subTitle,
//   searchQuery,
//   onSearchChange,
//   onAddClick,
//   showAddButton = true,
//   addButtonLabel,
//   rightContent,
//   notificationCount = 0,
//   onNotificationClick,
// }) => {
//   return (
//     <div
//       className="relative bg-[#2A4FBF] px-6 py-4 flex items-center justify-between rounded-md shadow-md"
//       style={{ width: "100%" }}
//     >
//       <div className="flex items-center gap-3">
//         <h1 className="text-white text-xl font-semibold">
//           {title}
//           {subTitle && <span className="text-sm font-normal block">{subTitle}</span>}
//         </h1>
//         {showAddButton && onAddClick && (
//           <button
//             className="flex items-center gap-2 whitespace-nowrap rounded-md bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
//             onClick={onAddClick}
//           > 
//             <Plus className="h-4 w-4" />
//             {addButtonLabel || 'New MoC Request'}
//           </button>
//         )}
//       </div>

//       {/* Right: Bell Icon */}
//       <div
//         className="relative cursor-pointer"
//         onClick={onNotificationClick}
//       >
//         <Bell className="w-7 h-7 text-white" />
//         {notificationCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
//             {notificationCount}
//           </span>
//         )}
//       </div>
//     </div>
//   )
// }

// export default GatePassTopHeader











// import React from "react";
// import { Bell } from "lucide-react";

// interface GatePassTopHeaderProps {
//   title: string;
//   subTitle?: string;
//   notificationCount?: number;
//   onNotificationClick?: () => void;
// }

// const GatePassTopHeader: React.FC<GatePassTopHeaderProps> = ({
//   title,
//   subTitle,
//   notificationCount = 0,
//   onNotificationClick,
// }) => {
//   return (
//     <div
//       className="relative bg-[#2A4FBF] px-6 py-5 flex items-center justify-between rounded-md shadow-md"
//       style={{ width: "100%" }}
//     >
//       {/* Left: Title and Subtitle */}
//       <div>
//         <h1 className="text-white text-2xl font-semibold">{title}</h1>
//         {subTitle && (
//           <p className="text-blue-100 text-sm font-medium mt-1">{subTitle}</p>
//         )}
//       </div>

//       {/* Right: Bell Icon */}
//       <div
//         className="relative cursor-pointer"
//         onClick={onNotificationClick}
//       >
//         <Bell className="w-7 h-7 text-white" />
//         {notificationCount > 0 && (
//           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
//             {notificationCount}
//           </span>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GatePassTopHeader;

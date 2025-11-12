import React from "react"
import { IUser, INavigationItem } from "@/utils/types"
import NewSideBarMenu from "./NewSideBarMenu"

interface IMergedSidebarProps {
  user: IUser
  username?: string | null
  userNavigation: INavigationItem[]
  isOpenMenu: boolean
  handleMenuStatus: () => void
}

const MergedSidebar: React.FC<IMergedSidebarProps> = ({
  user,
  username,
  userNavigation,
  isOpenMenu,
  handleMenuStatus,
}) => {
  return (
    <aside
      className={`flex flex-col h-screen transition-all bg-base-100 shadow-md border-r border-gray-200 ${
        isOpenMenu ? "w-65" : "w-10"
      }`}
    >
      {/* ✅ Removed avatar and username header section */}

      {/* Sidebar Menu Area */}
      <nav className="flex-1 scrollbar-hide min-h-0">
        <NewSideBarMenu isOpenMenu={isOpenMenu} />
      </nav>
    </aside>
  )
}

export default MergedSidebar

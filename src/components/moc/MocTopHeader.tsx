import api from '@/api/api'
import { Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

interface MocHeaderProps {
  title: string
  subTitle?: string
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onAddClick?: () => void
  showAddButton?: boolean
  addButtonLabel?: string
  rightContent?: React.ReactNode
}

const MocTopHeader: React.FC<MocHeaderProps> = ({
  title,
  subTitle,
  searchQuery,
  onSearchChange,
  onAddClick,
  showAddButton,
  addButtonLabel,
  rightContent,
}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
     const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);

        // ✅ Get username dynamically from localStorage (fallback: 'kiran')
        const storedUser = localStorage.getItem('userData');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const username = parsedUser?.username;

        const res = await api.get(`/notifications/user/${encodeURIComponent(username)}`)

        if (res.data && Array.isArray(res.data)) {
          setNotifications(res.data);
          // setTimeout(() => {toast.success("Fetching new Notification")},1000);
        }
      } catch (error) {
        console.error('🚨 Failed to fetch notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div
      className="relative bg-[#1E6FBF] px-6 py-4 flex items-center justify-between rounded-md shadow-md"
      style={{ width: "100%" }}
    >
      <h1 className="text-white text-xl font-semibold">
        {title}
        {subTitle && <span className="text-sm font-normal block">{subTitle}</span>}
      </h1>
      {showAddButton && onAddClick && (
        <button
          className="flex items-center gap-1 whitespace-nowrap rounded-md bg-white px-2 py-2 text-sm font-medium text-blue-600 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600"
          onClick={onAddClick}
        > 
          <Plus className="h-4 w-4" />
          {addButtonLabel || 'New MoC Request'}
        </button>
      )}
    </div>
  )
}

export default MocTopHeader
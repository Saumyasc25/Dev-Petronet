import React, { useState, useEffect } from 'react';
import NotificationTopHeader from '../Notifications/NotificationTopHeader';
import SearchFilter from '../Notifications/SearchFilter';
import NotificationCards from '../Notifications/NotificationCards';
import { useNavigate } from 'react-router-dom';
import api from '@/api/api';
import { toast } from 'react-toastify';

interface Notification {
  id: number;
  type: 'review' | 'approval' | 'approved' | 'changes' | 'rejected';
  title: string;
  description: string;
  requestNumber: string;
  timestamp: string;
  status: string;
  created_by?: string;
  requestorNo?: string;
  date?: string;
}

interface FilterOptions {
  created_by: string;
  requestorNo: string;
  startDate: string;
  endDate: string;
  status: string;
}

const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterOptions>({
    created_by: '',
    requestorNo: '',
    startDate: '',
    endDate: '',
    status: ''
  });

const mapNotificationType = (item: any): Notification['type'] => {
  const t = item.type?.toLowerCase();

  if (t === "review") return "review";
  if (t === "approval") {
    const title = item.title?.toLowerCase();
    if (title.includes("approved")) return "approved";
    if (title.includes("rejected")) return "rejected";
    if (title.includes("change")) return "changes";
    return "approval";
  }
  if (t === "closure") return "approved";
  return "review";
};

  const extractRequestNumber = (desc: string) => {
    const match = desc.match(/Moc\/[A-Za-z]+\/\d{4}-\d{2}\/\d{3}/i);
    return match ? match[0] : 'Unknown';
  };

useEffect(() => {
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const storedUser = localStorage.getItem('userData');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const username = parsedUser?.username;
      const res = await api.get(`/notifications/user/${encodeURIComponent(username)}`);
      if (Array.isArray(res.data)) {
        const mapped: Notification[] = res.data.map((item: any): Notification => ({
          id: item.id,
          type: mapNotificationType(item),        // ✅ returns Notification['type']
          title: item.title,
          description: item.description,
          requestNumber: extractRequestNumber(item.description),
          timestamp: item.date,
          status: item.type,
          created_by: item.from_user,
          requestorNo: item.to_user,
          date: item.date
        }));
        setNotifications(mapped);
        setTimeout(() => toast.success("Fetching new Notification"), 1000);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchNotifications();
}, []);

  const handleAction = (action: string, id: number): void => {
    if (action === 'approved') navigate(`/station-operations/moc`);
    if (action === 'edit') navigate(`/station-operations/moc`);
    if (action === 'view') navigate(`/station-operations/moc`);
  };

  const filteredNotifications = notifications.filter((notification: Notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.requestNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRequestorName =
      !filters.created_by || notification.created_by === filters.created_by;
    const matchesRequestorNo =
      !filters.requestorNo || notification.requestorNo === filters.requestorNo;
    const matchesStatus = !filters.status || notification.status === filters.status;
    let matchesDateRange = true;
    if (filters.startDate && filters.endDate && notification.date) {
      const date = new Date(notification.date);
      const start = new Date(filters.startDate);
      const end = new Date(filters.endDate);
      matchesDateRange = date >= start && date <= end;
    }
    return matchesSearch && matchesRequestorName && matchesRequestorNo && matchesStatus && matchesDateRange;
  });

  const uniqueRequestorNames = Array.from(
    new Set(notifications.map(n => n.created_by).filter(Boolean))
  ) as string[];

  const uniqueRequestorNos = Array.from(
    new Set(notifications.map(n => n.requestorNo).filter(Boolean))
  ) as string[];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }}>
      <div className="rounded-md mb-1">
        <NotificationTopHeader title="Notifications" subTitle="Stay updated with all your MoC activities" />
      </div>
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFiltersChange={setFilters}
        uniqueRequestorNames={uniqueRequestorNames}
        uniqueRequestorNos={uniqueRequestorNos}
        searchPlaceholder="Search here..."
      />
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', marginBottom: '20px' }}>
        <div className="max-w-6xl mx-auto p-3">
          <NotificationCards
            notifications={filteredNotifications}
            loading={loading}
            searchQuery={searchQuery}
            onAction={handleAction}
          />
        </div>
      </div>
      <div
        style={{
          position: 'fixed',
          bottom: 'clamp(12px, 3vw, 20px)',
          right: 'clamp(12px, 3vw, 20px)',
          zIndex: 50
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center rounded-md -mb-3 mr-5 font-semibold text-white transition-all shadow-lg"
          style={{
            backgroundColor: '#2563eb',
            height: '44px',
            minWidth: '120px'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NotificationsPage;

import React from 'react';
import { Bell, Clock, Info, CheckCircle, AlertCircle, XCircle, ChevronRight } from 'lucide-react';
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
interface NotificationCardsProps {
  notifications: Notification[];
  loading: boolean;
  searchQuery: string;
  onAction: (action: string, id: number) => void;
}

const NotificationCards: React.FC<NotificationCardsProps> = ({
  notifications,
  loading,
  searchQuery,
  onAction
}) => {

  const getIcon = (type: Notification['type']): JSX.Element => {
    switch (type) {
      case 'review':
        return <Clock className="w-6 h-6 text-gray-500" />;
      case 'approval':
        return <Info className="w-6 h-6 text-blue-500" />;
      case 'approved':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'changes':
        return <AlertCircle className="w-6 h-6 text-yellow-500" />;
      case 'rejected':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Info className="w-6 h-6 text-gray-500" />;
    }
  };

  const getActionButton = (type: Notification['type'], id: number): JSX.Element => {
    let label = '';
    let bg = '';
    let hover = '';
    let action = '';

    switch (type) {
      case 'review':
        label = 'Review Now';
        bg = 'bg-blue-100 text-blue-700 border-blue-300';
        hover = 'hover:bg-blue-200';
        action = 'review';
        break;

      case 'approval':
        label = 'Proceed';
        bg = 'bg-indigo-100 text-indigo-700 border-indigo-300';
        hover = 'hover:bg-indigo-200';
        action = 'view';
        break;

      case 'approved':
        label = 'View Approval';
        bg = 'bg-green-100 text-green-700 border-green-300';
        hover = 'hover:bg-green-200';
        action = 'view';
        break;

      case 'rejected':
        label = 'View Rejection';
        bg = 'bg-red-100 text-red-700 border-red-300';
        hover = 'hover:bg-red-200';
        action = 'view';
        break;

      case 'changes':
        label = 'Edit Request';
        bg = 'bg-yellow-100 text-yellow-700 border-yellow-300';
        hover = 'hover:bg-yellow-200';
        action = 'edit';
        break;

      default:
        label = 'View Details';
        bg = 'bg-gray-100 text-gray-700 border-gray-300';
        hover = 'hover:bg-gray-200';
        action = 'view';
    }

    return (
      <button
        onClick={() => onAction(action, id)}
        className={`px-5 py-2.5 rounded-lg font-medium transition-colors inline-flex items-center gap-2 border ${bg} ${hover}`}
      >
        {label}
        <ChevronRight className="w-4 h-4" />
      </button>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }


  if (notifications.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications found</h3>
        <p className="text-gray-500">
          {searchQuery ? 'Try adjusting your search criteria' : "You're all caught up!"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification: Notification) => (
        <div
          key={notification.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="p-5 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex gap-4 flex-1">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                    {getIcon(notification.type)}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {notification.title}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-3 leading-relaxed">
                    {notification.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md font-medium">
                      {notification.requestNumber}
                    </span>
                    <span className="text-gray-500">• {notification.timestamp}</span>
                  </div>
                </div>
              </div>
              {/* <div className="flex-shrink-0 lg:ml-4">
                {getActionButton(notification.type, notification.id)}
              </div> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationCards;

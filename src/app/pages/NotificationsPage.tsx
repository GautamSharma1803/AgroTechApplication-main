import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import {
  ArrowLeft,
  Bell,
  AlertCircle,
  Info,
  CheckCircle,
  Calendar,
  Droplets,
  TrendingUp,
  ShoppingCart
} from 'lucide-react';

interface Notification {
  id: number;
  type: 'alert' | 'info' | 'success' | 'task';
  title: string;
  message: string;
  time: string;
  read: boolean;
  icon: any;
}

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'alert',
      title: 'Disease Detected',
      message: 'Disease detected in your wheat field. Check the diagnosis report for details.',
      time: '2 hours ago',
      read: false,
      icon: AlertCircle
    },
    {
      id: 2,
      type: 'task',
      title: 'Watering Reminder',
      message: 'Water your tomato plants today for optimal growth.',
      time: '4 hours ago',
      read: false,
      icon: Droplets
    },
    {
      id: 3,
      type: 'success',
      title: 'Harvest Ready',
      message: 'Your corn crop is ready for harvest! Expected yield: 500kg',
      time: '1 day ago',
      read: true,
      icon: CheckCircle
    },
    {
      id: 4,
      type: 'info',
      title: 'Market Price Update',
      message: 'Tomato prices increased by 5%. Good time to sell!',
      time: '1 day ago',
      read: true,
      icon: TrendingUp
    },
    {
      id: 5,
      type: 'task',
      title: 'Fertilizer Schedule',
      message: 'Apply nitrogen fertilizer to wheat field this week.',
      time: '2 days ago',
      read: true,
      icon: Calendar
    },
    {
      id: 6,
      type: 'info',
      title: 'New Market Listing',
      message: 'Fresh organic wheat available near your location.',
      time: '3 days ago',
      read: true,
      icon: ShoppingCart
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'alert':
        return 'bg-red-50 border-red-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'task':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'alert':
        return 'text-red-600';
      case 'success':
        return 'text-green-600';
      case 'task':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto pb-20">
      {/* Header */}
      <div className="bg-green-600 p-6 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/home')} className="text-white">
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-white text-2xl font-bold">Notifications</h1>
          </div>
          {unreadCount > 0 && (
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">{unreadCount}</span>
            </div>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-white text-sm underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="p-6">
        {notifications.length === 0 ? (
          <Card className="rounded-2xl p-12 text-center">
            <Bell className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No notifications
            </h3>
            <p className="text-gray-600">
              You're all caught up! Check back later for updates.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = notification.icon;
              return (
                <Card
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`rounded-xl p-4 cursor-pointer transition-all border ${
                    getNotificationColor(notification.type)
                  } ${!notification.read ? 'shadow-md' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 ${getIconColor(notification.type)}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className={`font-semibold text-gray-900 ${
                          !notification.read ? 'font-bold' : ''
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-green-600 rounded-full flex-shrink-0 mt-2 ml-2"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

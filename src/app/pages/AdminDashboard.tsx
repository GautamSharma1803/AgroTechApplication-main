import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  ArrowLeft, 
  Users, 
  ShoppingCart, 
  Activity, 
  TrendingUp,
  Eye,
  Ban,
  CheckCircle,
  AlertCircle,
  Package,
  DollarSign,
  Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { admin as adminApi } from '../utils/api';

interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  email: string;
  activity: string;
  timestamp: Date;
  type: 'login' | 'purchase' | 'listing' | 'diagnosis' | 'other';
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  items: any[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt: Date;
}

interface UserInfo {
  id: string;
  email: string;
  name: string;
  phone?: string;
  status: 'active' | 'suspended';
  joinedDate: Date;
  totalOrders: number;
  totalSpent: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/home');
      return;
    }
    loadAdminData();
  }, [isAdmin, navigate]);

  async function loadAdminData() {
    try {
      // Fetch real data from backend
      const [fetchedUsers, fetchedOrders, fetchedActivities] = await Promise.all([
        adminApi.getUsers(),
        adminApi.getOrders(),
        adminApi.getUserActivities()
      ]);

      setUsers(fetchedUsers || []);
      setOrders(fetchedOrders || []);
      setUserActivities(fetchedActivities || []);

      // Calculate stats from real data
      setStats({
        totalUsers: fetchedUsers?.length || 0,
        activeUsers: fetchedUsers?.filter((u: UserInfo) => u.status === 'active').length || 0,
        totalOrders: fetchedOrders?.length || 0,
        totalRevenue: fetchedOrders?.reduce((sum: number, o: Order) => sum + o.total, 0) || 0,
        pendingOrders: fetchedOrders?.filter((o: Order) => o.status === 'pending').length || 0,
        completedOrders: fetchedOrders?.filter((o: Order) => o.status === 'completed').length || 0
      });

      // Only show success if we actually have data
      if (fetchedUsers?.length > 0 || fetchedOrders?.length > 0 || fetchedActivities?.length > 0) {
        toast.success('Admin dashboard loaded successfully');
      } else {
        toast.info('Dashboard loaded. No user activity yet.');
      }
    } catch (error: any) {
      console.error('Failed to load admin data:', error);

      // Check if it's a network error or backend not deployed
      if (error.message?.includes('fetch') || error.message?.includes('Network')) {
        toast.error('Cannot connect to backend. Please check if Edge Functions are deployed.');
      } else {
        toast.warning('Using demo data. Deploy backend for real-time information.');
      }

      // Fallback to mock data only if backend fails
      loadMockData();
    }
  }

  function loadMockData() {
    // Mock data as fallback
    const mockActivities: UserActivity[] = [
      {
        id: '1',
        userId: 'user-001',
        userName: 'John Farmer',
        email: 'john@example.com',
        activity: 'Purchased Fresh Tomatoes (5kg)',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        type: 'purchase'
      },
      {
        id: '2',
        userId: 'user-002',
        userName: 'Sarah Green',
        email: 'sarah@example.com',
        activity: 'Created new listing: Organic Wheat',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        type: 'listing'
      },
      {
        id: '3',
        userId: 'user-003',
        userName: 'Mike Wilson',
        email: 'mike@example.com',
        activity: 'Diagnosed plant disease',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        type: 'diagnosis'
      },
      {
        id: '4',
        userId: 'user-001',
        userName: 'John Farmer',
        email: 'john@example.com',
        activity: 'Logged in to the app',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        type: 'login'
      },
      {
        id: '5',
        userId: 'user-004',
        userName: 'Emily Davis',
        email: 'emily@example.com',
        activity: 'Purchased Organic Wheat (10kg)',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        type: 'purchase'
      }
    ];

    const mockOrders: Order[] = [
      {
        id: 'ORD-001',
        userId: 'user-001',
        userName: 'John Farmer',
        items: [{ name: 'Fresh Tomatoes', quantity: 5, price: 45 }],
        total: 225,
        status: 'pending',
        createdAt: new Date(Date.now() - 1000 * 60 * 5)
      },
      {
        id: 'ORD-002',
        userId: 'user-004',
        userName: 'Emily Davis',
        items: [{ name: 'Organic Wheat', quantity: 10, price: 30 }],
        total: 300,
        status: 'completed',
        createdAt: new Date(Date.now() - 1000 * 60 * 60)
      },
      {
        id: 'ORD-003',
        userId: 'user-005',
        userName: 'David Brown',
        items: [{ name: 'Sweet Corn', quantity: 8, price: 35 }],
        total: 280,
        status: 'processing',
        createdAt: new Date(Date.now() - 1000 * 60 * 90)
      }
    ];

    const mockUsers: UserInfo[] = [
      {
        id: 'user-001',
        email: 'john@example.com',
        name: 'John Farmer',
        phone: '+91 9876543210',
        status: 'active',
        joinedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
        totalOrders: 5,
        totalSpent: 1250
      },
      {
        id: 'user-002',
        email: 'sarah@example.com',
        name: 'Sarah Green',
        phone: '+91 9876543211',
        status: 'active',
        joinedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45),
        totalOrders: 3,
        totalSpent: 890
      },
      {
        id: 'user-003',
        email: 'mike@example.com',
        name: 'Mike Wilson',
        phone: '+91 9876543212',
        status: 'active',
        joinedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
        totalOrders: 7,
        totalSpent: 2100
      },
      {
        id: 'user-004',
        email: 'emily@example.com',
        name: 'Emily Davis',
        phone: '+91 9876543213',
        status: 'active',
        joinedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
        totalOrders: 4,
        totalSpent: 1050
      }
    ];

    setUserActivities(mockActivities);
    setOrders(mockOrders);
    setUsers(mockUsers);
    setStats({
      totalUsers: mockUsers.length,
      activeUsers: mockUsers.filter(u => u.status === 'active').length,
      totalOrders: mockOrders.length,
      totalRevenue: mockOrders.reduce((sum, o) => sum + o.total, 0),
      pendingOrders: mockOrders.filter(o => o.status === 'pending').length,
      completedOrders: mockOrders.filter(o => o.status === 'completed').length
    });
  }

  const handleSuspendUser = async (userId: string) => {
    try {
      await adminApi.suspendUser(userId);
      setUsers(prev => prev.map(user =>
        user.id === userId ? { ...user, status: 'suspended' as const } : user
      ));
      toast.success('User suspended successfully');
    } catch (error: any) {
      console.error('Failed to suspend user:', error);
      // Update locally even if backend fails
      setUsers(prev => prev.map(user =>
        user.id === userId ? { ...user, status: 'suspended' as const } : user
      ));
      toast.info('User suspended locally (backend not connected)');
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      await adminApi.activateUser(userId);
      setUsers(prev => prev.map(user =>
        user.id === userId ? { ...user, status: 'active' as const } : user
      ));
      toast.success('User activated successfully');
    } catch (error: any) {
      console.error('Failed to activate user:', error);
      // Update locally even if backend fails
      setUsers(prev => prev.map(user =>
        user.id === userId ? { ...user, status: 'active' as const } : user
      ));
      toast.info('User activated locally (backend not connected)');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success(`Order ${orderId} updated to ${newStatus}`);
    } catch (error: any) {
      console.error('Failed to update order:', error);
      // Update locally even if backend fails
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.info(`Order updated locally (backend not connected)`);
    }
  };

  const getActivityIcon = (type: UserActivity['type']) => {
    switch (type) {
      case 'login': return <Activity className="text-blue-500" size={16} />;
      case 'purchase': return <ShoppingCart className="text-green-500" size={16} />;
      case 'listing': return <Package className="text-orange-500" size={16} />;
      case 'diagnosis': return <AlertCircle className="text-purple-500" size={16} />;
      default: return <Eye className="text-gray-500" size={16} />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-700',
      suspended: 'bg-red-100 text-red-700',
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return (
      <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (date: Date) => {
    const now = Date.now();
    const diff = now - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="bg-purple-600 p-6 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/home')} className="text-white">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-white text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-purple-100 text-sm">Manage users and monitor activity</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Card className="bg-white/10 border-0 text-white p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Users size={20} />
              </div>
              <div>
                <p className="text-xs text-white/80">Total Users</p>
                <p className="text-xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white/10 border-0 text-white p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <ShoppingCart size={20} />
              </div>
              <div>
                <p className="text-xs text-white/80">Total Orders</p>
                <p className="text-xl font-bold">{stats.totalOrders}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white/10 border-0 text-white p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="text-xs text-white/80">Revenue</p>
                <p className="text-xl font-bold">₹{stats.totalRevenue}</p>
              </div>
            </div>
          </Card>

          <Card className="bg-white/10 border-0 text-white p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-xs text-white/80">Active Users</p>
                <p className="text-xl font-bold">{stats.activeUsers}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Activity</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>

          {/* Activity Tab */}
          <TabsContent value="overview">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Recent User Activity</h3>
              <div className="space-y-4">
                {userActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <p className="font-semibold text-gray-900">{activity.userName}</p>
                          <p className="text-sm text-gray-600">{activity.email}</p>
                        </div>
                        <span className="text-xs text-gray-500">{formatDate(activity.timestamp)}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">{activity.activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">User Management</h3>
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <Users className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Joined {formatDate(user.joinedDate)} • {user.totalOrders} orders • ₹{user.totalSpent} spent
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(user.status)}
                      {user.status === 'active' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSuspendUser(user.id)}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <Ban size={16} className="mr-1" />
                          Suspend
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleActivateUser(user.id)}
                          className="text-green-600 border-green-300 hover:bg-green-50"
                        >
                          <CheckCircle size={16} className="mr-1" />
                          Activate
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Order Management</h3>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.userName}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">₹{order.total}</p>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      {order.items.map((item, idx) => (
                        <p key={idx} className="text-sm text-gray-700">
                          {item.name} × {item.quantity}
                        </p>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Process Order
                        </Button>
                      )}
                      {order.status === 'processing' && (
                        <Button
                          size="sm"
                          onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Mark Complete
                        </Button>
                      )}
                      {(order.status === 'pending' || order.status === 'processing') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { 
  Leaf, 
  Droplets, 
  TrendingUp, 
  ShoppingCart, 
  Camera, 
  Cloud,
  Bell,
  User,
  Search,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useAuth } from '../contexts/AuthContext';
import { weather as weatherApi, crops as cropsApi } from '../utils/api';

export default function HomeScreen() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [weather, setWeather] = useState<any>(null);
  const [recentCrops, setRecentCrops] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Load weather
      const weatherData = await weatherApi.get();
      setWeather(weatherData);

      // Load recent crops
      const cropsData = await cropsApi.getAll();
      setRecentCrops(cropsData.slice(0, 2));
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }

  const features = [
    {
      title: 'Diagnose',
      description: 'Detect plant diseases',
      icon: Camera,
      color: 'bg-green-100 text-green-600',
      path: '/diagnose'
    },
    {
      title: 'Soil Health',
      description: 'Check soil status',
      icon: Droplets,
      color: 'bg-blue-100 text-blue-600',
      path: '/soil-health'
    },
    {
      title: 'My Crops',
      description: 'Manage your crops',
      icon: Leaf,
      color: 'bg-emerald-100 text-emerald-600',
      path: '/crops'
    },
    {
      title: 'Market',
      description: 'Buy & sell produce',
      icon: ShoppingCart,
      color: 'bg-orange-100 text-orange-600',
      path: '/market'
    }
  ];

  const alerts = [
    { message: 'Water your tomato plants today', type: 'info' },
    { message: 'Disease detected in wheat field', type: 'warning' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto pb-20">
      {/* Header */}
      <div className="bg-green-600 rounded-b-[2rem] p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-2xl font-bold">Welcome Back!</h1>
            <p className="text-green-100 text-sm">{user?.user_metadata?.fullName || user?.email}</p>
          </div>
          <div className="flex gap-3">
            <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bell className="text-white" size={20} />
            </button>
            <button 
              onClick={signOut}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            >
              <User className="text-white" size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search crops, diseases..."
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/95 text-gray-900 placeholder-gray-500"
          />
        </div>
      </div>

      <div className="px-6 -mt-4">
        {/* Weather Card */}
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Cloud size={24} />
                <span className="text-sm">Today's Weather</span>
              </div>
              <p className="text-4xl font-bold">{weather?.temp || 28}°C</p>
              <p className="text-blue-100 mt-1">{weather?.description || 'Loading...'}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-100">Humidity</p>
              <p className="text-2xl font-semibold">{weather?.humidity || 65}%</p>
            </div>
          </div>
        </Card>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="mb-6 space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl flex items-center gap-3 ${
                  alert.type === 'warning'
                    ? 'bg-orange-50 border border-orange-200'
                    : 'bg-blue-50 border border-blue-200'
                }`}
              >
                <AlertCircle
                  className={alert.type === 'warning' ? 'text-orange-600' : 'text-blue-600'}
                  size={20}
                />
                <p className="text-sm text-gray-700 flex-1">{alert.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  onClick={() => navigate(feature.path)}
                  className="p-6 rounded-2xl cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-3`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <button className="text-green-600 text-sm">View All</button>
          </div>
          <div className="space-y-3">
            {recentCrops.map((crop, index) => (
              <Card key={index} className="p-4 rounded-xl">
                <div className="flex items-center gap-4">
                  <ImageWithFallback
                    src={crop.image}
                    alt={crop.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{crop.name}</p>
                    <p className="text-sm text-gray-600">{crop.status}</p>
                  </div>
                  <Calendar className="text-gray-400" size={20} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 max-w-md mx-auto">
        <div className="flex items-center justify-around p-4">
          <button className="flex flex-col items-center gap-1 text-green-600">
            <Leaf size={24} />
            <span className="text-xs">Home</span>
          </button>
          <button 
            onClick={() => navigate('/crops')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <TrendingUp size={24} />
            <span className="text-xs">Crops</span>
          </button>
          <button 
            onClick={() => navigate('/market')}
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <ShoppingCart size={24} />
            <span className="text-xs">Market</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <User size={24} />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
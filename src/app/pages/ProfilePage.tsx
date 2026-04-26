import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Settings,
  LogOut,
  Edit,
  Shield,
  Bell,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const profileSections = [
    {
      icon: Edit,
      title: 'Edit Profile',
      description: 'Update your personal information',
      action: () => toast.info('Edit profile coming soon!')
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Manage notification preferences',
      action: () => navigate('/notifications')
    },
    {
      icon: Settings,
      title: 'Settings',
      description: 'App preferences and configurations',
      action: () => toast.info('Settings coming soon!')
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Manage your privacy settings',
      action: () => toast.info('Privacy settings coming soon!')
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      description: 'Get help with the app',
      action: () => toast.info('Support coming soon!')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto pb-20">
      {/* Header */}
      <div className="bg-green-600 p-6 rounded-b-[2rem] pb-20">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/home')} className="text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-xl font-bold">Profile</h1>
          <div className="w-6"></div>
        </div>
      </div>

      <div className="px-6 -mt-12">
        {/* Profile Card */}
        <Card className="rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <User className="text-green-600" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {user?.user_metadata?.fullName || 'User'}
            </h2>
            <p className="text-gray-600 mb-4">{user?.email}</p>

            <div className="w-full grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Mail className="text-gray-400" size={16} />
                <div className="text-left">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="text-gray-400" size={16} />
                <div className="text-left">
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.user_metadata?.phone || 'Not set'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Sections */}
        <div className="space-y-3 mb-6">
          {profileSections.map((section, index) => {
            const Icon = section.icon;
            return (
              <Card
                key={index}
                onClick={section.action}
                className="rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Icon className="text-gray-600" size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{section.title}</h3>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                  <ArrowLeft className="text-gray-400 rotate-180" size={20} />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          className="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center justify-center gap-2"
        >
          <LogOut size={20} />
          Logout
        </Button>

        {/* App Version */}
        <p className="text-center text-sm text-gray-500 mt-6">
          AgriApp v1.0.0
        </p>
      </div>
    </div>
  );
}

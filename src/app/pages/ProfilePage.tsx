import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
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
  HelpCircle,
  X,
  Save
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [editData, setEditData] = useState({
    fullName: user?.user_metadata?.fullName || '',
    phone: user?.user_metadata?.phone || '',
    location: user?.user_metadata?.location || ''
  });
  const [notificationSettings, setNotificationSettings] = useState({
    cropReminders: true,
    weatherAlerts: true,
    marketUpdates: true,
    diseaseAlerts: true
  });

  const handleLogout = () => {
    signOut();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleEditProfile = () => {
    setEditData({
      fullName: user?.user_metadata?.fullName || '',
      phone: user?.user_metadata?.phone || '',
      location: user?.user_metadata?.location || ''
    });
    setShowEditModal(true);
  };

  const handleSaveProfile = () => {
    // In a real app, you would update the user profile here
    toast.success('Profile updated successfully!');
    setShowEditModal(false);
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully!');
    setShowSettingsModal(false);
  };

  const profileSections = [
    {
      icon: Edit,
      title: 'Edit Profile',
      description: 'Update your personal information',
      action: handleEditProfile
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
      action: () => setShowSettingsModal(true)
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Manage your privacy settings',
      action: () => setShowPrivacyModal(true)
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      description: 'Get help with the app',
      action: () => setShowHelpModal(true)
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

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <Card className="w-full max-w-sm p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <Input
                  type="text"
                  value={editData.fullName}
                  onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border-gray-300"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border-gray-300"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <Input
                  type="text"
                  value={editData.location}
                  onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border-gray-300"
                  placeholder="Enter your location"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowEditModal(false)}
                variant="outline"
                className="flex-1 h-12 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProfile}
                className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Save
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <Card className="w-full max-w-sm p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Settings</h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Notification Preferences</h4>
                
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Crop Reminders</span>
                    <input
                      type="checkbox"
                      checked={notificationSettings.cropReminders}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          cropReminders: e.target.checked
                        })
                      }
                      className="w-5 h-5 text-green-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Weather Alerts</span>
                    <input
                      type="checkbox"
                      checked={notificationSettings.weatherAlerts}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          weatherAlerts: e.target.checked
                        })
                      }
                      className="w-5 h-5 text-green-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Market Updates</span>
                    <input
                      type="checkbox"
                      checked={notificationSettings.marketUpdates}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          marketUpdates: e.target.checked
                        })
                      }
                      className="w-5 h-5 text-green-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Disease Alerts</span>
                    <input
                      type="checkbox"
                      checked={notificationSettings.diseaseAlerts}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          diseaseAlerts: e.target.checked
                        })
                      }
                      className="w-5 h-5 text-green-600 rounded"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowSettingsModal(false)}
                variant="outline"
                className="flex-1 h-12 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveSettings}
                className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl"
              >
                Save
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <Card className="w-full max-w-sm p-6 rounded-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Privacy & Security</h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Data Collection</h4>
                <p className="text-sm text-gray-600 mb-4">
                  We collect data to improve your farming experience, including crop data, soil health information, and market preferences.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Data Sharing</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Your data is never shared with third parties without your explicit consent. We use it solely to provide you with better agricultural insights.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Account Security</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Your account is protected with industry-standard encryption. We recommend using a strong password and enabling two-factor authentication.
                </p>
              </div>

              <Button
                onClick={() => {
                  toast.info('Password change feature coming soon!');
                }}
                variant="outline"
                className="w-full h-12 rounded-xl"
              >
                Change Password
              </Button>
            </div>

            <Button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full h-12 mt-6 bg-green-600 hover:bg-green-700 text-white rounded-xl"
            >
              Close
            </Button>
          </Card>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <Card className="w-full max-w-sm p-6 rounded-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Help & Support</h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">FAQ</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">How do I diagnose plant diseases?</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Go to the Diagnose section, take a clear photo of the affected plant part, and upload it for AI analysis.
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700">How accurate are soil health reports?</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Our soil health analysis uses advanced algorithms and provides recommendations based on standard agricultural practices.
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-700">How do I sell my produce?</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Visit the Market section, switch to the "Sell" tab, and create a listing with your product details and photos.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Contact Support</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Need more help? Reach out to our support team:
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-700">📧 Email: support@agrotech.com</p>
                  <p className="text-sm text-gray-700">📞 Phone: +91-1234567890</p>
                  <p className="text-sm text-gray-700">⏰ Hours: Mon-Sat, 9 AM - 6 PM IST</p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setShowHelpModal(false)}
              className="w-full h-12 mt-6 bg-green-600 hover:bg-green-700 text-white rounded-xl"
            >
              Close
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}

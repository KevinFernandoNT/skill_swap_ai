import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Lock, Save, Camera, Eye, EyeOff } from 'lucide-react';
import { useCurrentUser, useUpdateProfile, useChangePassword } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

type ProfileData = {
  name: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  github: string;
  avatar: string | File;
};

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Get current user from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
    }
  }, []);

  const { data: user, refetch } = useCurrentUser();
  const updateProfile = useUpdateProfile({
    onSuccess: async () => {
      toast({ title: 'Profile updated!' });
      // Refetch fresh user from API
      const refreshed = await refetch();
      const latestUser = (refreshed?.data as any) || null;
      if (latestUser) {
        // Preserve access and stream chat tokens
        const accessToken = localStorage.getItem('token');
        const streamToken = localStorage.getItem('stream_chat_token');
        localStorage.setItem('user', JSON.stringify(latestUser));
        if (accessToken) localStorage.setItem('token', accessToken);
        if (streamToken) localStorage.setItem('stream_chat_token', streamToken);

        // Broadcast real-time user update event so other components update immediately
        window.dispatchEvent(new CustomEvent('userUpdated', { detail: { user: latestUser } }));
      }
    },
    onError: (error) => { toast({ title: 'Error', description: error?.response?.data?.message || 'Failed to update profile', variant: 'destructive' }); },
  });
  const changePassword = useChangePassword({
    onSuccess: () => { toast({ title: 'Password changed!' }); setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); },
    onError: (error) => { toast({ title: 'Error', description: error?.response?.data?.message || 'Failed to change password', variant: 'destructive' }); },
  });
  const { toast } = useToast();

  // Profile form state
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '+94 (555) 123-4567',
    website: 'https://alexjohnson.dev',
    linkedin: 'https://linkedin.com/in/alexjohnson',
    github: 'https://github.com/alexjohnson',
    avatar: ''
  });

  // Update profile data when current user is loaded
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || ''
      }));
    }
  }, [user]);

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    sessionReminders: true,
    newMessages: true,
    skillMatches: false,
    weeklyDigest: true,
    marketingEmails: false
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(profileData).forEach(([key, value]) => {
      if (key === 'avatar' && value instanceof File) {
        formData.append('avatar', value);
      } else if (key !== 'avatar') {
        formData.append(key, value);
      }
    });
    updateProfile.mutate(formData);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileData(prev => ({ ...prev, avatar: e.target.files[0] }));
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({ title: 'Error', description: 'New passwords do not match', variant: 'destructive' });
      return;
    }
    changePassword.mutate({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
  };

  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle notification preferences update
    console.log('Notifications updated:', notifications);
    // Show success message
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Mail }
  ];



  return (
    <div className="bg-black min-h-screen">
      {/* Header */}
      <div className="px-4 py-6 border-b border-gray-800 lg:px-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-400">Manage your account settings and preferences</p>
      </div>

      <div className="px-4 py-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Tab Navigation */}
          <div className="border-b border-gray-800 mb-8">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-8">
              {/* Avatar Section */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-medium text-white mb-4">Profile Picture</h3>
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <img
                      src={typeof profileData.avatar === 'string' ? profileData.avatar : URL.createObjectURL(profileData.avatar)}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{profileData.name}</h4>
                    <p className="text-gray-400 text-sm">JPG, GIF or PNG. 1MB max.</p>
                    <button
                      type="button"
                      className="mt-2 text-sm text-primary hover:text-primary/80"
                    >
                      Change avatar
                    </button>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-medium text-white mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                                     <div>
                     <label className="block text-sm font-medium text-gray-300 mb-2">
                       Phone Number
                     </label>
                     <input
                       type="tel"
                       name="phone"
                       value={profileData.phone}
                       onChange={handleProfileChange}
                       className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                     />
                   </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-medium text-white mb-4">Social Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={profileData.website}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={profileData.linkedin}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      GitHub
                    </label>
                    <input
                      type="url"
                      name="github"
                      value={profileData.github}
                      onChange={handleProfileChange}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-8">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 pr-10 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 pr-10 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 pr-10 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Update Password
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <form onSubmit={handleNotificationSubmit} className="space-y-8">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-medium text-white mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium text-sm">
                          {key === 'emailNotifications' && 'Email Notifications'}
                          {key === 'sessionReminders' && 'Session Reminders'}
                          {key === 'newMessages' && 'New Messages'}
                          {key === 'skillMatches' && 'Skill Matches'}
                          {key === 'weeklyDigest' && 'Weekly Digest'}
                          {key === 'marketingEmails' && 'Marketing Emails'}
                        </h4>
                        <p className="text-sm text-gray-400">
                          {key === 'emailNotifications' && 'Receive email notifications for important updates'}
                          {key === 'sessionReminders' && 'Get reminded about upcoming sessions'}
                          {key === 'newMessages' && 'Notifications when you receive new messages'}
                          {key === 'skillMatches' && 'Get notified when someone matches your skills'}
                          {key === 'weeklyDigest' && 'Weekly summary of your activity'}
                          {key === 'marketingEmails' && 'Promotional emails and feature updates'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name={key}
                          checked={value}
                          onChange={handleNotificationChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
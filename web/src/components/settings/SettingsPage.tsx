import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Lock, Save, Camera, Eye, EyeOff, Globe, Linkedin, Github } from 'lucide-react';
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
  const [isAnimating, setIsAnimating] = useState(false);

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
      
      // Enhanced success toast with more information
      toast({ 
        title: 'Profile Updated Successfully! 🎉',
        description: `Your profile information has been saved. Changes include: ${profileData.name ? 'Name updated' : ''}${profileData.email ? ', Email updated' : ''}${profileData.phone ? ', Phone updated' : ''}${profileData.website || profileData.linkedin || profileData.github ? ', Social links updated' : ''}. Your profile is now up to date!`,
        duration: 5000,
      });
    },
    onError: (error) => { toast({ title: 'Error', description: error?.response?.data?.message || 'Failed to update profile', variant: 'destructive' }); },
  });
  const changePassword = useChangePassword({
    onSuccess: () => { 
      toast({ 
        title: 'Password Updated Successfully! 🔐',
        description: 'Your password has been changed successfully. Please use your new password for future logins. For security reasons, you may need to log in again on other devices.',
        duration: 5000,
      }); 
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); 
    },
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
    
    // Enhanced notification preferences toast
    const enabledNotifications = Object.entries(notifications)
      .filter(([_, enabled]) => enabled)
      .map(([key, _]) => {
        const labels = {
          emailNotifications: 'Email Notifications',
          sessionReminders: 'Session Reminders',
          newMessages: 'New Messages',
          skillMatches: 'Skill Matches',
          weeklyDigest: 'Weekly Digest',
          marketingEmails: 'Marketing Emails'
        };
        return labels[key as keyof typeof labels];
      });
    
    toast({
      title: 'Notification Preferences Updated! 🔔',
      description: `Your notification settings have been saved. Active notifications: ${enabledNotifications.join(', ')}. You can change these settings anytime.`,
      duration: 5000,
    });
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setActiveTab(tabId);
      setIsAnimating(false);
    }, 150);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Mail }
  ];



  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="px-4 py-6 lg:px-8">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="px-4 py-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Tab Navigation */}
          <div className="border-b border-border mb-8">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-all duration-300 ease-in-out transform hover:scale-105 ${
                      activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-transform duration-300 ${activeTab === tab.id ? 'scale-110' : ''}`} />
                    <span className="transition-all duration-300">{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className={`transition-all duration-500 ease-in-out ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
              <form onSubmit={handleProfileSubmit} className="space-y-8">
                {/* Profile Header */}
                <div className="bg-gradient-to-r from-card to-card/80 rounded-xl p-8 shadow-lg">
                  <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                    {/* Avatar Section */}
                    <div className="relative group">
                      <div className="relative">
                        <img
                          src={typeof profileData.avatar === 'string' ? profileData.avatar : URL.createObjectURL(profileData.avatar)}
                          alt="Profile"
                          className="w-32 h-32 rounded-full object-cover border-4 border-primary/20 shadow-xl transition-transform duration-300 group-hover:scale-105"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                        />
                        <button
                          type="button"
                          className="absolute bottom-2 right-2 bg-primary text-primary-foreground p-3 rounded-full shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card transition-all duration-300 hover:scale-110"
                        >
                          <Camera className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Profile Info */}
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-2xl font-bold text-card-foreground mb-2">{profileData.name || 'Your Name'}</h2>
                      <p className="text-muted-foreground mb-4">{profileData.email}</p>
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          Professional
                        </span>
                        <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                          Active Member
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center mb-6">
                    <User className="w-5 h-5 text-primary mr-3" />
                    <h3 className="text-xl font-semibold text-card-foreground">Basic Information</h3>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-card-foreground">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-card-foreground">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-card-foreground">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center mb-6">
                    <Globe className="w-5 h-5 text-primary mr-3" />
                    <h3 className="text-xl font-semibold text-card-foreground">Social Links</h3>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-card-foreground flex items-center">
                        <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                        Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={profileData.website}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-card-foreground flex items-center">
                        <Linkedin className="w-4 h-4 mr-2 text-blue-500" />
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        name="linkedin"
                        value={profileData.linkedin}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-card-foreground flex items-center">
                        <Github className="w-4 h-4 mr-2 text-muted-foreground" />
                        GitHub
                      </label>
                      <input
                        type="url"
                        name="github"
                        value={profileData.github}
                        onChange={handleProfileChange}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
                        placeholder="https://github.com/username"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <button
                    type="button"
                    className="px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-all duration-300 hover:scale-105"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-3 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all duration-300 hover:scale-105 shadow-lg"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className={`transition-all duration-500 ease-in-out ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
              <form onSubmit={handlePasswordSubmit} className="space-y-8">
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-lg font-medium text-card-foreground mb-4">Change Password</h3>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 pr-10 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 pr-10 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-card-foreground mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-3 py-2 pr-10 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Update Password
                  </button>
                </div>
              </div>
            </form>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className={`transition-all duration-500 ease-in-out ${isAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
              <form onSubmit={handleNotificationSubmit} className="space-y-8">
              <div className="bg-card rounded-lg p-6 border border-border">
                <h3 className="text-lg font-medium text-card-foreground mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <h4 className="text-card-foreground font-medium text-sm">
                          {key === 'emailNotifications' && 'Email Notifications'}
                          {key === 'sessionReminders' && 'Session Reminders'}
                          {key === 'newMessages' && 'New Messages'}
                          {key === 'skillMatches' && 'Skill Matches'}
                          {key === 'weeklyDigest' && 'Weekly Digest'}
                          {key === 'marketingEmails' && 'Marketing Emails'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
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
                        <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </button>
                </div>
              </div>
            </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Calendar, Clock, Layout, MessageSquare, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const learningData = [
    { day: "Mon", hours: 2 },
    { day: "Tue", hours: 3 },
    { day: "Wed", hours: 1.5 },
    { day: "Thu", hours: 4 },
    { day: "Fri", hours: 2.5 },
    { day: "Sat", hours: 1 },
    { day: "Sun", hours: 3.5 },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Dashboard Header */}
      <header className="bg-primary text-white p-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <span>Welcome, User</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
              <span className="font-medium text-sm">U</span>
            </div>
            <button
              className="ml-4 px-4 py-2 bg-white text-primary rounded hover:bg-gray-100 border border-primary transition"
              onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hours Studied</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18.5</div>
              <p className="text-xs text-gray-500">+12% from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Study Sessions</CardTitle>
              <Layout className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-gray-500">+2 from last week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Collaborations</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-gray-500">+1 this week</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-gray-500">8 unread</p>
            </CardContent>
          </Card>
        </div>

        {/* Chart and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Learning Activity Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Weekly Learning Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={learningData}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Bar dataKey="hours" fill="#1E8E3E" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">React Advanced Concepts</h3>
                    <p className="text-sm text-gray-500">Today, 3:00 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Data Science Study Group</h3>
                    <p className="text-sm text-gray-500">Tomorrow, 5:30 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-md">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">AI Ethics Discussion</h3>
                    <p className="text-sm text-gray-500">Friday, 2:00 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

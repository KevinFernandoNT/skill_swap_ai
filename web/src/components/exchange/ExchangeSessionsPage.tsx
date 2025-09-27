import React, { useMemo, useState } from "react";
import { Calendar, Clock, ArrowRightLeft } from "lucide-react";
import { useGetExchangeSessions } from "@/hooks/useGetExchangeSessions";
import { ExchangeSession } from "@/hooks/useGetUpcomingExchangeSessions";
import UserProfile from "@/components/ui/UserProfile";
import { ExchangeSessionsDataTable } from './ExchangeSessionsDataTable';
import { ExchangeSessionDetailsSheet } from './ExchangeSessionDetailsSheet';

import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

const ExchangeSessionsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<"all" | "upcoming" | "completed" | "expired">("all");
  const [search, setSearch] = useState("");
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<ExchangeSession | null>(null);

  const { data, isLoading, error, refetch } = useGetExchangeSessions();
  const sessions: ExchangeSession[] = data?.data || [];

  // Determine current user id for display purposes (to show "You")
  const currentUserId = (() => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      const u = JSON.parse(userStr);
      return u?._id || u?.id || null;
    } catch {
      return null;
    }
  })();

  const { toast } = useToast();
  const [completingSessions, setCompletingSessions] = useState<Set<string>>(new Set());

  // Use a single completion handler that works with any session
  const handleComplete = async (sessionId: string) => {
    setCompletingSessions(prev => new Set(prev).add(sessionId));
    
    try {
      await api.patch(`/exchange-sessions/${sessionId}/complete`);
      toast({ title: 'Session completed' });
      refetch();
    } catch (error: any) {
      toast({ 
        title: 'Failed to complete', 
        description: error?.response?.data?.message || 'Network error', 
        variant: 'destructive' 
      });
    } finally {
      setCompletingSessions(prev => {
        const newSet = new Set(prev);
        newSet.delete(sessionId);
        return newSet;
      });
    }
  };

  const filtered = useMemo(() => {
    return sessions.filter((s) => {
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      const matchesSearch =
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.skillCategory.toLowerCase().includes(search.toLowerCase()) ||
        s.skillId.name.toLowerCase().includes(search.toLowerCase()) ||
        s.requestedSkillId.name.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [sessions, statusFilter, search]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handleViewDetails = (session: ExchangeSession) => {
    setSelectedSession(session);
    setIsDetailsSheetOpen(true);
  };

  const handleCloseDetailsSheet = () => {
    setIsDetailsSheetOpen(false);
    setSelectedSession(null);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="px-4 py-6 lg:px-8">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-foreground">Exchange Sessions</h1>
          <p className="mt-1 text-sm text-muted-foreground">View and manage your skill exchange sessions</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
              statusFilter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All ({filtered.length})
          </button>
          <button
            onClick={() => setStatusFilter('upcoming')}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
              statusFilter === 'upcoming'
                ? 'bg-blue-600 text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Upcoming ({filtered.filter(s => s.status === 'upcoming').length})
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
              statusFilter === 'completed'
                ? 'bg-green-600 text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Completed ({filtered.filter(s => s.status === 'completed').length})
          </button>
          <button
            onClick={() => setStatusFilter('expired')}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
              statusFilter === 'expired'
                ? 'bg-red-600 text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Expired ({filtered.filter(s => s.status === 'expired').length})
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or skills..."
            className="w-full max-w-md py-2 px-3 text-sm bg-background border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        {/* Exchange Sessions Table */}
        <ExchangeSessionsDataTable
          data={filtered}
          onViewDetails={handleViewDetails}
          onComplete={handleComplete}
          isLoading={isLoading}
        />
      </div>

      {/* Exchange Session Details Sheet */}
      <ExchangeSessionDetailsSheet
        isOpen={isDetailsSheetOpen}
        onOpenChange={setIsDetailsSheetOpen}
        session={selectedSession}
        onComplete={handleComplete}
      />
    </div>
  );
};

export default ExchangeSessionsPage;



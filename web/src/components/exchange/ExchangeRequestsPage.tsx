import React, { useState } from 'react';
import { Calendar, Clock, User, ArrowRightLeft, CheckCircle, XCircle, Clock as ClockIcon, MessageCircle, Loader2, Crown } from 'lucide-react';
import { ExchangeRequest } from '../../types';
import { useGetExchangeRequests } from '../../hooks/useGetExchangeRequests';
import { useUpdateExchangeRequest, useUpdateExchangeRequestById } from '../../hooks/useUpdateExchangeRequest';
import { useToast } from '../../hooks/use-toast';
import { ExchangeRequestsDataTable } from './ExchangeRequestsDataTable';
import { ExchangeRequestDetailsSheet } from './ExchangeRequestDetailsSheet';

const ExchangeRequestsPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ExchangeRequest | null>(null);
  // Single list view: only received requests for the current user
  const { toast } = useToast();

  // Get current user from localStorage
  const getCurrentUserId = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      return user._id || user.id;
    }
    return null;
  };

  const currentUserId = getCurrentUserId();

  // Fetch regular exchange requests from API
  const { data: exchangeRequestsResponse, isLoading: isLoadingExchangeRequests, error: exchangeRequestsError, refetch: refetchExchangeRequests } = useGetExchangeRequests();
  const exchangeRequests: ExchangeRequest[] = Array.isArray(exchangeRequestsResponse?.data) ? exchangeRequestsResponse.data : Array.isArray(exchangeRequestsResponse) ? exchangeRequestsResponse : [];

  // Hosted session requests tab removed from this page

  // Update exchange request function
  const updateExchangeRequestStatus = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '/api';
      const response = await fetch(`${baseURL}/exchange-requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update exchange request');
      }

      toast({
        title: `Request ${status === 'accepted' ? 'Accepted' : 'Rejected'}`,
        description: `Exchange request ${status} successfully!`
      });

      // Refetch data
      refetchExchangeRequests();
    } catch (error: any) {
      toast({
        title: `${status === 'accepted' ? 'Accept' : 'Reject'} Failed`,
        description: error?.message || `Could not ${status} exchange request.`,
        variant: "destructive",
      });
    }
  };

  const handleAcceptRequest = (requestId: string) => {
    updateExchangeRequestStatus(requestId, 'accepted');
  };

  const handleRejectRequest = (requestId: string) => {
    updateExchangeRequestStatus(requestId, 'rejected');
  };

  // Get all exchange requests where current user is the recipient (not requester)
  const userExchangeRequests = currentUserId 
    ? exchangeRequests.filter(request => 
        request.recipient._id === currentUserId
      )
    : [];

  // Single source of truth for this page
  const getCurrentRequests = () => userExchangeRequests;

  const filteredRequests = getCurrentRequests().filter(request => {
    if (filterStatus === 'all') return true;
    return request.status === filterStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-900 text-yellow-300';
      case 'accepted':
        return 'bg-green-900 text-green-300';
      case 'rejected':
        return 'bg-red-900 text-red-300';
      case 'cancelled':
        return 'bg-gray-900 text-gray-300';
      default:
        return 'bg-gray-800 text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <ClockIcon className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isRequester = (request: ExchangeRequest) => {
    // Since we're only showing requests where current user is recipient, they are never the requester
    return false;
  };

  const isLoading = isLoadingExchangeRequests;
  const error = exchangeRequestsError;

  // Check if user is logged in
  if (!currentUserId) {
    return (
      <div className="bg-background min-h-screen">
        <div className="px-4 py-6 lg:px-8">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-foreground">Exchange Requests</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage your skill swap requests and responses</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="bg-muted/20 border border-border/30 rounded-lg p-6">
            <h3 className="text-lg font-medium text-foreground mb-2">Please Log In</h3>
            <p className="text-muted-foreground mb-4">
              You need to be logged in to view your exchange requests.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-background min-h-screen">
        <div className="px-4 py-6 lg:px-8">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-foreground">Exchange Requests</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage your skill swap requests and responses</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin mr-3" />
          <span className="text-foreground">Loading exchange requests...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-background min-h-screen">
        <div className="px-4 py-6 lg:px-8">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-foreground">Exchange Requests</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage your skill swap requests and responses</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="bg-destructive/20 border border-destructive/30 rounded-lg p-6">
            <h3 className="text-lg font-medium text-foreground mb-2">Error Loading Requests</h3>
            <p className="text-muted-foreground mb-4">
              {error?.response?.data?.message || "Could not load exchange requests. Please try again."}
            </p>
            <button
              onClick={() => refetchExchangeRequests()}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleViewDetails = (request: ExchangeRequest) => {
    setSelectedRequest(request);
    setIsDetailsSheetOpen(true);
  };

  const handleCloseDetailsSheet = () => {
    setIsDetailsSheetOpen(false);
    setSelectedRequest(null);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="px-4 py-6 lg:px-8">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-foreground">Exchange Requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your skill swap requests and responses</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
              filterStatus === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All ({getCurrentRequests().length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
              filterStatus === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Pending ({getCurrentRequests().filter(r => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilterStatus('accepted')}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
              filterStatus === 'accepted'
                ? 'bg-green-600 text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Accepted ({getCurrentRequests().filter(r => r.status === 'accepted').length})
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
              filterStatus === 'rejected'
                ? 'bg-red-600 text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Rejected ({getCurrentRequests().filter(r => r.status === 'rejected').length})
          </button>
        </div>

        {/* Exchange Requests Table */}
        <ExchangeRequestsDataTable
          data={filteredRequests}
          onAccept={handleAcceptRequest}
          onReject={handleRejectRequest}
          onViewDetails={handleViewDetails}
          isLoading={isLoadingExchangeRequests}
        />
      </div>

      {/* Exchange Request Details Sheet */}
      <ExchangeRequestDetailsSheet
        isOpen={isDetailsSheetOpen}
        onOpenChange={setIsDetailsSheetOpen}
        request={selectedRequest}
      />
    </div>
  );
};

export default ExchangeRequestsPage; 
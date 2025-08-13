import React, { useState } from 'react';
import { Calendar, Clock, User, ArrowRightLeft, CheckCircle, XCircle, Clock as ClockIcon, MessageCircle, Loader2, Crown } from 'lucide-react';
import { ExchangeRequest } from '../../types';
import { useGetExchangeRequests } from '../../hooks/useGetExchangeRequests';
import { useUpdateExchangeRequest, useUpdateExchangeRequestById } from '../../hooks/useUpdateExchangeRequest';
import { useToast } from '../../hooks/use-toast';

const ExchangeRequestsPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
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
      <div className="bg-black min-h-screen">
        <div className="px-4 py-6 border-b border-gray-800 lg:px-8">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-white">Exchange Requests</h1>
            <p className="mt-1 text-sm text-gray-400">Manage your skill swap requests and responses</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="bg-gray-900/20 border border-gray-500/30 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-2">Please Log In</h3>
            <p className="text-gray-400 mb-4">
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
      <div className="bg-black min-h-screen">
        <div className="px-4 py-6 border-b border-gray-800 lg:px-8">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-white">Exchange Requests</h1>
            <p className="mt-1 text-sm text-gray-400">Manage your skill swap requests and responses</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary animate-spin mr-3" />
          <span className="text-white">Loading exchange requests...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-black min-h-screen">
        <div className="px-4 py-6 border-b border-gray-800 lg:px-8">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-white">Exchange Requests</h1>
            <p className="mt-1 text-sm text-gray-400">Manage your skill swap requests and responses</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
            <h3 className="text-lg font-medium text-white mb-2">Error Loading Requests</h3>
            <p className="text-gray-400 mb-4">
              {error?.response?.data?.message || "Could not load exchange requests. Please try again."}
            </p>
            <button
              onClick={() => refetchExchangeRequests()}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      {/* Header */}
      <div className="px-4 py-6 border-b border-gray-800 lg:px-8">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white">Exchange Requests</h1>
          <p className="mt-1 text-sm text-gray-400">Manage your skill swap requests and responses</p>
        </div>

        {/* Tabs removed: this page now only shows received requests */}
      </div>

      <div className="px-4 py-6 lg:px-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
              filterStatus === 'all'
                ? 'bg-primary text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All ({getCurrentRequests().length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
              filterStatus === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Pending ({getCurrentRequests().filter(r => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilterStatus('accepted')}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
              filterStatus === 'accepted'
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Accepted ({getCurrentRequests().filter(r => r.status === 'accepted').length})
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
              filterStatus === 'rejected'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Rejected ({getCurrentRequests().filter(r => r.status === 'rejected').length})
          </button>
        </div>

        {/* Exchange Requests List */}
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div
              key={request._id}
              className="bg-gray-900 rounded-lg border border-gray-800 p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Left side - Request details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-1">
                        {request.sessionId?.title || 'Session Title TBD'}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-300">
                          {request.sessionId?.skillCategory || 'Skill Category TBD'}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1 capitalize">{request.status}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Session details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{request.sessionId?.date ? new Date(request.sessionId.date).toLocaleDateString() : 'Date TBD'}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{request.sessionId?.startTime || 'TBD'} - {request.sessionId?.endTime || 'TBD'}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        <span>with {request.recipient?.name || 'Session Host'}</span>
                      </div>
                    </div>

                    {/* Exchange details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ArrowRightLeft className="w-4 h-4 text-primary" />
                        <span className="text-sm text-gray-300">
                          Offered : <span className="text-primary font-medium">{request.offeredSkillId?.name || 'Unknown Skill'}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRightLeft className="w-4 h-4 text-primary" />
                        <span className="text-sm text-gray-300">
                           For : <span className="text-primary font-medium">{request.requestedSkillId?.name || 'Unknown Skill'}</span>
                        </span>
                      </div>
                      
                      {/* User details for the person offering the skill */}
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <img 
                              src={request.requester?.avatar || ''} 
                              alt={request.requester?.name || 'User'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center" style={{ display: 'none' }}>
                              <span className="text-white text-sm font-semibold">
                                {request.requester?.name?.charAt(0) || 'U'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-white font-medium">{request.requester?.name || 'User'}</p>
                            {request.requester?.email && (
                              <p className="text-xs text-gray-400">{request.requester.email}</p>
                            )}
                            <div className="mt-1">
                              <span className="text-xs text-gray-500">Offering: </span>
                              <span className="text-xs text-primary font-medium">{request.offeredSkillId?.name}</span>
                              <span className="text-xs text-gray-500 ml-1">({request.offeredSkillId?.proficiency}% proficiency)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  {request.message && (
                    <div className="bg-gray-800 rounded-md p-3 mb-4">
                      <div className="flex items-start gap-2">
                        <MessageCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-300">{request.message}</p>
                      </div>
                    </div>
                  )}

                  {/* Timestamp */}
                  <p className="text-xs text-gray-500">
                    Received on {formatDate(request.createdAt)}
                  </p>
                </div>

                {/* Right side - Actions */}
                <div className="flex flex-col gap-2 lg:flex-shrink-0">
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAcceptRequest(request._id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                      >
                        Accept Request
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request._id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                      >
                        Reject Request
                      </button>
                    </>
                  )}

                  {request.status === 'accepted' && (
                    <div className="text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-900 text-green-300">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Accepted
                      </span>
                    </div>
                  )}

                  {request.status === 'rejected' && (
                    <div className="text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-900 text-red-300">
                        <XCircle className="w-3 h-3 mr-1" />
                        Rejected
                      </span>
                    </div>
                  )}

                  {request.status === 'cancelled' && (
                    <div className="text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-900 text-gray-300">
                        <XCircle className="w-3 h-3 mr-1" />
                        Cancelled
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <ArrowRightLeft className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No exchange requests found</h3>
            <p className="text-gray-400">{filterStatus === 'all' ? "You haven't received any exchange requests yet." : `No ${filterStatus} exchange requests found.`}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExchangeRequestsPage; 
import React, { useState } from 'react';
import { Calendar, Clock, User, ArrowRightLeft, CheckCircle, XCircle, Clock as ClockIcon, MessageCircle } from 'lucide-react';
import { ExchangeRequest } from '../../types';
import { exchangeRequests, currentUser } from '../../data/mockData';

const ExchangeRequestsPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Get all exchange requests where current user is either requester or recipient
  const userExchangeRequests = exchangeRequests.filter(request => 
    request.requester.id === currentUser.id || request.recipient.id === currentUser.id
  );

  const filteredRequests = userExchangeRequests.filter(request => {
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

  const handleAcceptRequest = (requestId: string) => {
    // In a real app, this would update the request status via API
    console.log('Accepting request:', requestId);
    alert('Request accepted! The session details will be shared with both parties.');
  };

  const handleRejectRequest = (requestId: string) => {
    // In a real app, this would update the request status via API
    console.log('Rejecting request:', requestId);
    alert('Request rejected.');
  };

  const handleCancelRequest = (requestId: string) => {
    // In a real app, this would update the request status via API
    console.log('Cancelling request:', requestId);
    alert('Request cancelled.');
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
    return request.requester.id === currentUser.id;
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Header */}
      <div className="px-4 py-6 border-b border-gray-800 lg:px-8">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-white">Exchange Requests</h1>
          <p className="mt-1 text-sm text-gray-400">Manage your skill swap requests and responses</p>
        </div>
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
            All ({userExchangeRequests.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
              filterStatus === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Pending ({userExchangeRequests.filter(r => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilterStatus('accepted')}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
              filterStatus === 'accepted'
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Accepted ({userExchangeRequests.filter(r => r.status === 'accepted').length})
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
              filterStatus === 'rejected'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Rejected ({userExchangeRequests.filter(r => r.status === 'rejected').length})
          </button>
        </div>

        {/* Exchange Requests List */}
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="bg-gray-900 rounded-lg border border-gray-800 p-6 hover:border-gray-700 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Left side - Request details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-white mb-1">
                        {request.session.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900 text-blue-300">
                          {request.session.skillCategory}
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
                        <span>{new Date(request.session.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{request.session.startTime} - {request.session.endTime}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        <span>with {request.session.participant.name}</span>
                      </div>
                    </div>

                    {/* Exchange details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ArrowRightLeft className="w-4 h-4 text-primary" />
                        <span className="text-sm text-gray-300">
                          {isRequester(request) ? 'You offer' : `${request.requester.name} offers`}: <span className="text-primary font-medium">{request.offeredSkill}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowRightLeft className="w-4 h-4 text-primary" />
                        <span className="text-sm text-gray-300">
                          {isRequester(request) ? 'You request' : `${request.requester.name} requests`}: <span className="text-primary font-medium">{request.requestedSkill}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="bg-gray-800 rounded-md p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <MessageCircle className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-300">{request.message}</p>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <p className="text-xs text-gray-500">
                    {isRequester(request) ? 'Sent' : 'Received'} on {formatDate(request.createdAt)}
                  </p>
                </div>

                {/* Right side - Actions */}
                <div className="flex flex-col gap-2 lg:flex-shrink-0">
                  {request.status === 'pending' && !isRequester(request) && (
                    <>
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  
                  {request.status === 'pending' && isRequester(request) && (
                    <button
                      onClick={() => handleCancelRequest(request.id)}
                      className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel Request
                    </button>
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
            <p className="text-gray-400">
              {filterStatus === 'all'
                ? 'You haven\'t made or received any exchange requests yet.'
                : `No ${filterStatus} exchange requests found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExchangeRequestsPage; 
import { useQuery } from '@tanstack/react-query';
import { DashboardApiResponse } from '../types/dashboard';
import api from '@/lib/api';

const fetchDashboardData = async (): Promise<DashboardApiResponse> => {
  console.log('Fetching dashboard data...');
  console.log('Token in localStorage:', localStorage.getItem('token'));
  
  try {
    const response = await api.get<DashboardApiResponse>('/dashboard/data');
    console.log('Dashboard data response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    throw error;
  }
};

export const useDashboardData = () => {
  return useQuery({
    queryKey: ['dashboard-data'],
    queryFn: fetchDashboardData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

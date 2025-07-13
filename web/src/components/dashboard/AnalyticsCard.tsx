import { TrendingUp, TrendingDown, Clock, Users, Award, Calendar } from 'lucide-react';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: 'sessions' | 'time' | 'connections' | 'skills';
  trend?: number;
  subtext?: string;
  children?: React.ReactNode;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  subtext,
  children 
}) => {
  const getIconConfig = () => {
    switch (icon) {
      case 'sessions':
        return { 
          icon: <Calendar className="w-5 h-5 text-white" />, 
          bgColor: 'bg-primary' 
        };
      case 'time':
        return { 
          icon: <Clock className="w-5 h-5 text-white" />, 
          bgColor: 'bg-primary' 
        };
      case 'connections':
        return { 
          icon: <Users className="w-5 h-5 text-white" />, 
          bgColor: 'bg-primary' 
        };
      case 'skills':
        return { 
          icon: <Award className="w-5 h-5 text-white" />, 
          bgColor: 'bg-primary' 
        };
      default:
        return { 
          icon: <TrendingUp className="w-5 h-5 text-white" />, 
          bgColor: 'bg-primary' 
        };
    }
  };

  const { icon: iconElement, bgColor } = getIconConfig();

  return (
    <div className="bg-gray-900 rounded-lg shadow-sm border border-gray-800 overflow-hidden h-full transition-transform duration-300 hover:shadow-md hover:translate-y-[-2px]">
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-400">{title}</h3>
          <div className={`p-2 rounded-full ${bgColor}`}>
            {iconElement}
          </div>
        </div>
        
        <div className="flex items-baseline mb-1">
          <h2 className="text-3xl font-bold text-white">{value}</h2>
          
          {trend !== undefined && (
            <div className={`ml-2 flex items-center text-sm font-medium ${
              trend >= 0 ? 'text-primary' : 'text-red-400'
            }`}>
              {trend >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        
        {subtext && <p className="text-sm text-gray-400">{subtext}</p>}
        
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsCard;
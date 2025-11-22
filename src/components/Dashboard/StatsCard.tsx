interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <div className="glass rounded-xl sm:rounded-2xl p-6 border-4 border-transparent card-hover shadow-indigo-glow animate-scale-in"
         style={{ 
           backgroundImage: 'linear-gradient(white, white), linear-gradient(135deg, #667eea, #764ba2, #ec4899)',
           backgroundOrigin: 'padding-box, border-box',
           backgroundClip: 'padding-box, border-box'
         }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">{title}</p>
          <p className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-3 mb-2">
            {value}
          </p>
          {trend && (
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold mt-2 border-2 ${
              trend.isPositive 
                ? 'text-green-700 bg-green-100 border-green-300' 
                : 'text-red-700 bg-red-100 border-red-300'
            }`}>
              <span className={`text-lg ${trend.isPositive ? '↑' : '↓'}`}>
                {trend.isPositive ? '↑' : '↓'}
              </span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-purple-glow border-2 border-white/50 transform hover:scale-110 transition-transform duration-300">
            <div className="text-white">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

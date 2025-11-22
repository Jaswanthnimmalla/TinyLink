import { Link2, MousePointerClick, TrendingUp } from 'lucide-react';
import StatsCard from '../Dashboard/StatsCard';

interface StatsOverviewProps {
  totalLinks: number;
  totalClicks: number;
  averageClicks: number;
}

export default function StatsOverview({ totalLinks, totalClicks, averageClicks }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        title="Total Links"
        value={totalLinks}
        icon={<Link2 className="h-8 w-8" />}
      />
      <StatsCard
        title="Total Clicks"
        value={totalClicks}
        icon={<MousePointerClick className="h-8 w-8" />}
      />
      <StatsCard
        title="Avg. Clicks/Link"
        value={averageClicks.toFixed(1)}
        icon={<TrendingUp className="h-8 w-8" />}
      />
    </div>
  );
}

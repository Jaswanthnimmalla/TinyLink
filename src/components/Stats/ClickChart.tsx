'use client';

interface ClickChartProps {
  data: Array<{ date: string; clicks: number }>;
}

export default function ClickChart({ data }: ClickChartProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Click Analytics</h3>
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-sm">Chart visualization coming soon</p>
          <p className="text-xs text-gray-400 mt-2">
            {data.length} data points available
          </p>
        </div>
      </div>
    </div>
  );
}

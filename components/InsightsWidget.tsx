
import React from 'react';
import { ChartBarIcon, SparklesIcon, BookOpenIcon } from './IconComponents';

const InsightCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-gray-dark p-4 rounded-lg flex items-center gap-4">
    <div className="bg-brand-secondary p-3 rounded-lg">
        {icon}
    </div>
    <div>
      <p className="text-sm text-text-secondary">{title}</p>
      <p className="text-xl font-bold text-text-primary">{value}</p>
    </div>
  </div>
);

const InsightsWidget: React.FC = () => {
  // Data is hardcoded for this MVP.
  // In a real application, this would come from a data source or API.
  const insights = [
    { title: 'New Leads Today (AI)', value: '5', icon: <SparklesIcon className="w-6 h-6 text-white"/> },
    { title: 'Monthly Revenue', value: '$500,000', icon: <ChartBarIcon className="w-6 h-6 text-white"/> },
    { title: 'Top-Selling Product', value: 'The Quantum Mind', icon: <BookOpenIcon className="w-6 h-6 text-white"/> },
  ];

  return (
    <div className="bg-gray-medium rounded-lg p-4">
        <h2 className="text-lg font-bold text-text-primary mb-3 px-2">Quarterly Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {insights.map(item => <InsightCard key={item.title} {...item} />)}
        </div>
    </div>
  );
};

export default InsightsWidget;

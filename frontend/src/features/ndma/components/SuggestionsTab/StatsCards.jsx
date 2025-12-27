import React from 'react';
import { Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const cards = [
    {
      label: 'Total Suggestions',
      value: stats.total,
      icon: TrendingUp,
      color: 'var(--primary)',
    },
    {
      label: 'Pending Review',
      value: stats.pending,
      icon: Clock,
      color: 'var(--warning)',
    },
    {
      label: 'Approved',
      value: stats.approved,
      icon: CheckCircle,
      color: 'var(--success)',
    },
    {
      label: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      color: 'var(--error)',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="p-4 rounded-lg"
            style={{ backgroundColor: 'var(--surface-elevated)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {card.label}
              </span>
              <Icon size={20} style={{ color: card.color }} />
            </div>
            <div className="text-3xl font-bold" style={{ color: card.color }}>
              {card.value}
            </div>
            {card.label === 'Approved' && stats.approvalRate && (
              <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {stats.approvalRate}% approval rate
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;

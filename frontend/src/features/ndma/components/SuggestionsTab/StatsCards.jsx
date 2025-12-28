import React from 'react';
import { Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import '@styles/css/main.css';

/**
 * StatsCards Component for AI Suggestions
 * EXACT NDMA Layout: Header (Title LEFT, Icon RIGHT) → Value → Subtitle
 */
const StatsCards = ({ stats }) => {
  const cards = [
    {
      label: 'Total Suggestions',
      value: stats.total,
      icon: TrendingUp,
      colorClass: 'blue',
    },
    {
      label: 'Pending Review',
      value: stats.pending,
      icon: Clock,
      colorClass: 'amber',
    },
    {
      label: 'Approved',
      value: stats.approved,
      icon: CheckCircle,
      colorClass: 'green',
      subtitle: stats.approvalRate ? `${stats.approvalRate}% approval rate` : null,
    },
    {
      label: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      colorClass: 'red',
    },
  ];

  return (
    <div className="district-stats-grid">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`stat-card stat-card--${card.colorClass}`}
          >
            {/* Header: Title LEFT, Icon RIGHT */}
            <div className="stat-card__header">
              <span className="stat-card__title">{card.label}</span>
              <div className={`stat-card__icon stat-card__icon--${card.colorClass}`}>
                <Icon size={20} />
              </div>
            </div>

            {/* Value */}
            <div className="stat-card__value">{card.value}</div>

            {/* Subtitle (if any) */}
            {card.subtitle && (
              <span className="stat-card__subtitle">{card.subtitle}</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;

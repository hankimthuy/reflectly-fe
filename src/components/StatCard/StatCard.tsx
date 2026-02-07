import type React from 'react';
import './StatCard.scss';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  variant?: 'glass-dark' | 'glass-light';
  accentColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  variant = 'glass-dark',
  accentColor,
}) => {
  return (
    <div className={`stat-card stat-card--${variant}`}>
      <div className="stat-card__icon" style={accentColor ? { color: accentColor } : undefined}>
        {icon}
      </div>
      <div className="stat-card__body">
        <span className="stat-card__value">{value}</span>
        <span className="stat-card__label">{label}</span>
      </div>
    </div>
  );
};

export default StatCard;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LuChevronRight } from 'react-icons/lu';
import './Breadcrumb.scss';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  variant?: 'light' | 'dark';
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, variant = 'light' }) => {
  const navigate = useNavigate();

  return (
    <nav className={`breadcrumb breadcrumb--${variant}`}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {isLast ? (
              <span className="breadcrumb__current">{item.label}</span>
            ) : (
              <span
                className="breadcrumb__link"
                onClick={() => item.path && navigate(item.path)}
              >
                {item.label}
              </span>
            )}
            {!isLast && (
              <LuChevronRight size={14} className="breadcrumb__separator" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;

import React from 'react';
import { BookOpen, AlertCircle, Home, User, AlertTriangle, Search, UserCircle } from 'lucide-react';
import './CategoryFilters.css';

const iconMap = {
  BookOpen,
  AlertCircle,
  Home,
  User,
  AlertTriangle,
  Search,
  UserCircle,
};

export const CategoryFilters = ({
  categories,
  activeCategory,
  setActiveCategory,
  faqs,
}) => {
  return (
    <div className="category-filters">
      {categories.map((cat) => {
        const IconComponent = iconMap[cat.icon];
        return (
          <button
            key={cat.id}
            className={`category-chip ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.id)}
          >
            <span className="category-icon">
              {IconComponent && <IconComponent size={18} />}
            </span>
            <span>{cat.label}</span>
          {cat.id === 'All' && (
            <span className="category-count">{faqs.length}</span>
          )}
          {cat.id !== 'All' && (
            <span className="category-count">
              {faqs.filter((f) => f.category === cat.id).length}
            </span>
          )}
          </button>
        );
      })}
    </div>
  );
};

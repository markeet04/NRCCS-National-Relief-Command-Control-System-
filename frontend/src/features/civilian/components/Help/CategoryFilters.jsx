import React from 'react';
import './CategoryFilters.css';

export const CategoryFilters = ({
  categories,
  activeCategory,
  setActiveCategory,
  faqs,
}) => {
  return (
    <div className="category-filters">
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`category-chip ${activeCategory === cat.id ? 'active' : ''}`}
          onClick={() => setActiveCategory(cat.id)}
        >
          <span className="category-icon">{cat.icon}</span>
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
      ))}
    </div>
  );
};

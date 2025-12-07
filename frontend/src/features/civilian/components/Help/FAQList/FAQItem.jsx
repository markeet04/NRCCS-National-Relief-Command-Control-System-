import React from 'react';
import './FAQItem.css';

export const FAQItem = ({
  faq,
  isExpanded,
  onToggle,
  categoryIcon,
  animationDelay,
}) => {
  return (
    <div
      className={`faq-item ${isExpanded ? 'expanded' : ''}`}
      style={{ animationDelay }}
    >
      <button className="faq-question" onClick={onToggle}>
        <div className="faq-question-content">
          <span className="faq-category-badge">{categoryIcon}</span>
          <span className="faq-question-text">{faq.question}</span>
        </div>
        <span className={`faq-toggle ${isExpanded ? 'open' : ''}`}>▼</span>
      </button>

      {isExpanded && (
        <div className="faq-answer">
          <p>{faq.answer}</p>
          <div className="faq-tags">
            {faq.tags.map((tag, i) => (
              <span key={i} className="faq-tag">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

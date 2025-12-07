import React from 'react';
import { FAQItem } from './FAQItem';
import './FAQList.css';

export const FAQList = ({
  filteredFaqs,
  expandedFaq,
  toggleFaq,
  categories,
}) => {
  return (
    <div className="faq-list">
      {filteredFaqs.map((faq, index) => (
        <FAQItem
          key={faq.id}
          faq={faq}
          isExpanded={expandedFaq === faq.id}
          onToggle={() => toggleFaq(faq.id)}
          categoryIcon={categories.find((c) => c.id === faq.category)?.icon}
          animationDelay={`${index * 0.05}s`}
        />
      ))}
    </div>
  );
};

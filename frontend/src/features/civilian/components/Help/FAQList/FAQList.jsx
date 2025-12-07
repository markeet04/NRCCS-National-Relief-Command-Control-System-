import React from 'react';
import { BookOpen, AlertCircle, Home, User, AlertTriangle, Search, UserCircle } from 'lucide-react';
import { FAQItem } from './FAQItem';
import './FAQList.css';

export const FAQList = ({
  filteredFaqs,
  expandedFaq,
  toggleFaq,
  categories,
}) => {
  const iconMap = {
    BookOpen,
    AlertCircle,
    Home,
    User,
    AlertTriangle,
    Search,
    UserCircle,
  };

  return (
    <div className="faq-list">
      {filteredFaqs.map((faq, index) => {
        const iconName = categories.find((c) => c.id === faq.category)?.icon;
        const IconComponent = iconMap[iconName];
        
        return (
          <FAQItem
            key={faq.id}
            faq={faq}
            isExpanded={expandedFaq === faq.id}
            onToggle={() => toggleFaq(faq.id)}
            categoryIcon={IconComponent ? <IconComponent size={20} /> : null}
            animationDelay={`${index * 0.05}s`}
          />
        );
      })}
    </div>
  );
};

import React from 'react';
import { Phone, Mail, MessageSquare, MessageCircle } from 'lucide-react';
import './ContactSection.css';

export const ContactSection = ({ contactMethods }) => {
  const iconMap = {
    Phone,
    Mail,
    MessageSquare,
    MessageCircle,
  };
  
  return (
    <section className="contact-section">
      <div className="contact-header">
        <h2>Still Need Help?</h2>
        <p>Our support team is here to assist you 24/7</p>
      </div>

      <div className="contact-methods-grid">
        {contactMethods.map((method, index) => {
          const IconComponent = iconMap[method.icon];
          return (
          <a key={index} href={method.link} className="contact-method-card">
            <div className="contact-method-icon">{IconComponent ? <IconComponent size={32} /> : null}</div>
            <h3>{method.title}</h3>
            <div className="contact-value">{method.value}</div>
            <p>{method.description}</p>
          </a>
          );
        })}
      </div>
    </section>
  );
};

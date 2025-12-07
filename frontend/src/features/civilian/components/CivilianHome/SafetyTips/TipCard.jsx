import { Zap, Shield, Smartphone } from 'lucide-react';

const TipCard = ({ tip }) => {
  const iconMap = {
    Zap,
    Shield,
    Smartphone,
  };
  
  const IconComponent = iconMap[tip.icon];
  
  return (
    <div className="tip-card">
      <span className="tip-icon">{IconComponent ? <IconComponent size={32} /> : null}</span>
      <h3>{tip.title}</h3>
      <ul>
        {tip.tips.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default TipCard;

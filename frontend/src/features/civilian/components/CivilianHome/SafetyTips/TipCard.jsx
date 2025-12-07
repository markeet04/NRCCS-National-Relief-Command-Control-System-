const TipCard = ({ tip }) => {
  return (
    <div className="tip-card">
      <span className="tip-icon">{tip.icon}</span>
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

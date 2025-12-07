import React from 'react';
import './FeedbackSection.css';

export const FeedbackSection = () => {
  return (
    <section className="feedback-section">
      <div className="feedback-card">
        <h3>Was this helpful?</h3>
        <p>Help us improve our help center</p>
        <div className="feedback-buttons">
          <button className="feedback-btn positive">👍 Yes, helpful</button>
          <button className="feedback-btn negative">👎 Need more info</button>
        </div>
      </div>
    </section>
  );
};

import { useState, useEffect } from 'react';
import {
  HeroSection,
  QuickActionsOverlay,
  RecentAlertsSection,
  SafetyTipsSection,
  HelpSection,
} from '../components/CivilianHome';

const CivilianHome = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="civilian-home">
      <HeroSection isVisible={isVisible} />
      <QuickActionsOverlay />
      
      <div className="content-container">
        <RecentAlertsSection />
        <SafetyTipsSection />
        <HelpSection />
      </div>
    </div>
  );
};

export default CivilianHome;

import { Shield } from 'lucide-react';
import { SAFETY_TIPS } from '../../../constants';
import TipCard from './TipCard';

const SafetyTipsSection = () => {
  return (
    <section className="tips-section">
      <h2><Shield size={24} /> Safety Tips & Guidelines</h2>
      <div className="tips-grid">
        {SAFETY_TIPS.map((tip, index) => (
          <TipCard key={index} tip={tip} />
        ))}
      </div>
    </section>
  );
};

export default SafetyTipsSection;

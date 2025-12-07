import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home, Megaphone, Search } from 'lucide-react';
import { QUICK_ACTIONS } from '../../../constants';
import QuickActionCard from './QuickActionCard';

// Icon mapping
const iconMap = {
  AlertTriangle: AlertTriangle,
  Home: Home,
  Megaphone: Megaphone,
  Search: Search,
};

const QuickActionsOverlay = () => {
  const navigate = useNavigate();

  return (
    <div className="quick-actions-overlay">
      <div className="quick-actions-grid">
        {QUICK_ACTIONS.map((action, index) => {
          const IconComponent = iconMap[action.iconName];
          return (
            <QuickActionCard
              key={index}
              action={action}
              icon={<IconComponent size={32} strokeWidth={2.5} />}
              onClick={() => navigate(action.path)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionsOverlay;

import { Plus } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';
import './PageHeader.css';

const PageHeader = ({ onAddUser }) => {
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  return (
    <div className="user-management-header">
      <h2 className="user-management-header__title" style={{ color: colors.textPrimary }}>
        User Management
      </h2>
      <button onClick={onAddUser} className="user-management-header__add-btn">
        <Plus size={18} />
        Add User
      </button>
    </div>
  );
};

export default PageHeader;

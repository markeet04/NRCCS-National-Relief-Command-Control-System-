import { X, Sun, Moon, Plus, Minus, Type } from 'lucide-react';
import PropTypes from 'prop-types';
import { useSettings } from '@hooks';

const SettingsModal = ({ isOpen, onClose }) => {
  const { theme, fontSize, toggleTheme, increaseFontSize, decreaseFontSize } = useSettings();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(2, 6, 23, 0.35)', backdropFilter: 'blur(2px)' }}
      onClick={onClose}
    >
      <div 
        className="rounded-2xl shadow-2xl max-w-lg w-full mx-4"
        style={{ backgroundColor: theme === 'dark' ? '#252d3d' : '#ffffff', padding: '36px 32px', boxSizing: 'border-box', border: theme === 'dark' ? '1.5px solid #334155' : '1.5px solid #e2e8f0' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-6 mb-4 border-b" style={{ borderColor: theme === 'dark' ? 'rgba(148, 163, 184, 0.1)' : '#e2e8f0' }}>
          <h2 className="text-xl font-bold" style={{ color: theme === 'dark' ? '#ffffff' : '#1e293b' }}>
            Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
          >
            <X className="w-5 h-5" style={{ color: theme === 'dark' ? '#94a3b8' : '#64748b' }} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-7">
          {/* Theme Toggle */}
          <div className="mb-2">
            <label className="text-sm font-semibold mb-3 block" style={{ color: theme === 'dark' ? '#cbd5e1' : '#475569' }}>
              Theme
            </label>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center justify-between p-4 rounded-lg border transition-colors"
              style={{ 
                backgroundColor: theme === 'dark' ? '#1a1f2e' : '#f8fafc',
                borderColor: theme === 'dark' ? 'rgba(148, 163, 184, 0.1)' : '#e2e8f0'
              }}
            >
              <div className="flex items-center gap-3">
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5" style={{ color: '#60a5fa' }} />
                ) : (
                  <Sun className="w-5 h-5" style={{ color: '#f59e0b' }} />
                )}
                <span className="font-medium" style={{ color: theme === 'dark' ? '#ffffff' : '#1e293b' }}>
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              <span className="text-xs px-3 py-1 rounded-full" style={{ 
                backgroundColor: theme === 'dark' ? 'rgba(96, 165, 250, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: theme === 'dark' ? '#60a5fa' : '#f59e0b'
              }}>
                Active
              </span>
            </button>
          </div>

          {/* Font Size */}
          <div className="mb-2">
            <label className="text-sm font-semibold mb-3 block" style={{ color: theme === 'dark' ? '#cbd5e1' : '#475569' }}>
              Font Size
            </label>
            <div className="flex items-center gap-5">
              <button
                onClick={decreaseFontSize}
                disabled={fontSize === 'small'}
                className="flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: theme === 'dark' ? '#1a1f2e' : '#f8fafc',
                  borderColor: theme === 'dark' ? 'rgba(148, 163, 184, 0.1)' : '#e2e8f0'
                }}
              >
                <Minus className="w-4 h-4" style={{ color: theme === 'dark' ? '#94a3b8' : '#64748b' }} />
                <span className="font-medium" style={{ color: theme === 'dark' ? '#ffffff' : '#1e293b' }}>Smaller</span>
              </button>
              
              <div className="flex items-center justify-center px-6 py-4 rounded-lg border" style={{ 
                backgroundColor: theme === 'dark' ? '#1a1f2e' : '#f8fafc',
                borderColor: theme === 'dark' ? 'rgba(148, 163, 184, 0.1)' : '#e2e8f0',
                minWidth: '110px'
              }}>
                <Type className="w-5 h-5 mr-2" style={{ color: theme === 'dark' ? '#60a5fa' : '#3b82f6' }} />
                <span className="font-semibold capitalize" style={{ color: theme === 'dark' ? '#ffffff' : '#1e293b' }}>
                  {fontSize}
                </span>
              </div>

              <button
                onClick={increaseFontSize}
                disabled={fontSize === 'large'}
                className="flex-1 flex items-center justify-center gap-2 p-4 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ 
                  backgroundColor: theme === 'dark' ? '#1a1f2e' : '#f8fafc',
                  borderColor: theme === 'dark' ? 'rgba(148, 163, 184, 0.1)' : '#e2e8f0'
                }}
              >
                <Plus className="w-4 h-4" style={{ color: theme === 'dark' ? '#94a3b8' : '#64748b' }} />
                <span className="font-medium" style={{ color: theme === 'dark' ? '#ffffff' : '#1e293b' }}>Larger</span>
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="p-5 rounded-lg border" style={{ 
            backgroundColor: theme === 'dark' ? '#1a1f2e' : '#f8fafc',
            borderColor: theme === 'dark' ? 'rgba(148, 163, 184, 0.1)' : '#e2e8f0',
            marginTop: '10px',
            marginBottom: '10px'
          }}>
            <p className="text-xs mb-2" style={{ color: theme === 'dark' ? '#94a3b8' : '#64748b' }}>Preview:</p>
            <div style={{ padding: '12px 16px', background: theme === 'dark' ? 'rgba(30,41,59,0.7)' : 'rgba(241,245,249,0.7)', borderRadius: '8px' }}>
              <p style={{ 
                color: theme === 'dark' ? '#ffffff' : '#1e293b',
                fontSize: `${fontSize === 'small' ? 0.875 : fontSize === 'large' ? 1.125 : 1}rem`,
                margin: 0
              }}>
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 mt-4 border-t flex justify-end" style={{ borderColor: theme === 'dark' ? 'rgba(148, 163, 184, 0.1)' : '#e2e8f0' }}>
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-lg font-medium transition-colors shadow-sm"
            style={{ backgroundColor: '#0ea5e9', color: '#ffffff', fontSize: '1rem', letterSpacing: '0.01em' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

SettingsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default SettingsModal;

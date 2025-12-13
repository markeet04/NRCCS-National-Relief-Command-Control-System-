import { useState, useEffect } from 'react';
import { X, Sun, Moon, Type } from 'lucide-react';
import PropTypes from 'prop-types';
import { useSettings } from '@hooks';
import { getThemeColors } from '@shared/utils/themeColors';

const SettingsModal = ({ isOpen, onClose }) => {
  const { theme, fontSize, toggleTheme, increaseFontSize, decreaseFontSize } = useSettings();
  
  const [pendingTheme, setPendingTheme] = useState(theme);
  const [pendingFontSize, setPendingFontSize] = useState(fontSize);
  
  const fontSizeMap = { small: 14, medium: 16, large: 18 };
  const fontSizeToValue = { small: 0, medium: 50, large: 100 };
  
  useEffect(() => {
    if (isOpen) {
      setPendingTheme(theme);
      setPendingFontSize(fontSize);
    }
  }, [isOpen, theme, fontSize]);

  const handleSave = () => {
    if (pendingTheme !== theme) toggleTheme();
    if (pendingFontSize !== fontSize) {
      const currentIndex = ['small', 'medium', 'large'].indexOf(fontSize);
      const targetIndex = ['small', 'medium', 'large'].indexOf(pendingFontSize);
      const diff = targetIndex - currentIndex;
      if (diff > 0) for (let i = 0; i < diff; i++) increaseFontSize();
      else for (let i = 0; i < Math.abs(diff); i++) decreaseFontSize();
    }
    onClose();
  };

  const handleCancel = () => {
    setPendingTheme(theme);
    setPendingFontSize(fontSize);
    onClose();
  };

  const handleSliderChange = (e) => {
    const value = parseInt(e.target.value);
    if (value <= 25) setPendingFontSize('small');
    else if (value <= 75) setPendingFontSize('medium');
    else setPendingFontSize('large');
  };

  if (!isOpen) return null;

  const isDark = pendingTheme === 'dark';
  const colors = getThemeColors(!isDark);
  const modalBg = isDark ? colors.elevatedBg : '#ffffff';
  const cardBg = isDark ? colors.elevatedBg2 : '#f8fafc';
  const cardBorder = isDark ? colors.borderMedium : '#e2e8f0';
  const textPrimary = isDark ? colors.textPrimary : '#0f172a';
  const textSecondary = isDark ? colors.textSecondary : '#64748b';
  const sliderTrack = isDark ? colors.borderMedium : '#e2e8f0';

  return (
    <div 
      onClick={handleCancel}
      style={{ 
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        backdropFilter: 'blur(4px)',
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          backgroundColor: modalBg,
          width: '360px',
          maxWidth: '90vw',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 600, margin: 0 }}>Settings</h2>
          <button
            onClick={handleCancel}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X style={{ width: '18px', height: '18px', color: '#fff' }} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '20px' }}>
          {/* Appearance */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Sun style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
              <span style={{ fontSize: '13px', fontWeight: 600, color: textPrimary }}>Appearance</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {/* Light */}
              <button
                onClick={() => setPendingTheme('light')}
                style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '16px 12px',
                  borderRadius: '12px',
                  backgroundColor: cardBg,
                  border: pendingTheme === 'light' ? `2px solid ${colors.brandAccent}` : `1.5px solid ${cardBorder}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ 
                  width: '44px', height: '44px', borderRadius: '10px',
                  backgroundColor: isDark ? colors.borderMedium : '#f1f5f9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Sun style={{ width: '22px', height: '22px', color: colors.high }} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 500, color: textPrimary }}>Light</span>
              </button>
              
              {/* Dark */}
              <button
                onClick={() => setPendingTheme('dark')}
                style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '16px 12px',
                  borderRadius: '12px',
                  backgroundColor: cardBg,
                  border: pendingTheme === 'dark' ? `2px solid ${colors.brandAccent}` : `1.5px solid ${cardBorder}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ 
                  width: '44px', height: '44px', borderRadius: '10px',
                  backgroundColor: isDark ? colors.pageBg : colors.elevatedBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Moon style={{ width: '22px', height: '22px', color: colors.lowText }} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 500, color: textPrimary }}>Dark</span>
              </button>
            </div>
          </div>

          {/* Text Size */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Type style={{ width: '16px', height: '16px', color: textSecondary }} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: textPrimary }}>Text Size</span>
              </div>
              <span style={{ 
                fontSize: '12px', fontWeight: 500, color: '#10b981',
                backgroundColor: 'rgba(16,185,129,0.1)',
                padding: '3px 10px', borderRadius: '6px'
              }}>
                {fontSizeMap[pendingFontSize]}px
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: textSecondary }}>A</span>
              <input
                type="range" min="0" max="100" step="50"
                value={fontSizeToValue[pendingFontSize]}
                onChange={handleSliderChange}
                style={{
                  flex: 1, height: '6px', borderRadius: '3px',
                  appearance: 'none', cursor: 'pointer',
                  background: `linear-gradient(to right, #10b981 ${fontSizeToValue[pendingFontSize]}%, ${sliderTrack} ${fontSizeToValue[pendingFontSize]}%)`
                }}
              />
              <span style={{ fontSize: '16px', fontWeight: 600, color: textSecondary }}>A</span>
            </div>
            <style>{`
              input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 18px; height: 18px; border-radius: 50%;
                background: #10b981; cursor: pointer;
                border: 3px solid white;
                box-shadow: 0 1px 4px rgba(0,0,0,0.2);
              }
              input[type="range"]::-moz-range-thumb {
                width: 18px; height: 18px; border-radius: 50%;
                background: #10b981; cursor: pointer;
                border: 3px solid white;
              }
              input[type="range"]:focus { outline: none; }
            `}</style>
          </div>

          {/* Preview */}
          <div style={{ 
            backgroundColor: cardBg, borderRadius: '10px',
            padding: '14px 16px', marginBottom: '20px',
            border: `1px solid ${cardBorder}`
          }}>
            <p style={{ 
              color: textPrimary, fontSize: `${fontSizeMap[pendingFontSize]}px`,
              textAlign: 'center', margin: 0, lineHeight: 1.5
            }}>
              The quick brown fox jumps
            </p>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleCancel}
              style={{ 
                flex: 1, padding: '11px 16px', borderRadius: '10px',
                fontSize: '14px', fontWeight: 600,
                backgroundColor: cardBg, color: textSecondary,
                border: `1px solid ${cardBorder}`, cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{ 
                flex: 1, padding: '11px 16px', borderRadius: '10px',
                fontSize: '14px', fontWeight: 600,
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff', border: 'none', cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(16,185,129,0.3)'
              }}
            >
              Save
            </button>
          </div>
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

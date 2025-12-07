import { Map, Layers, Eye, EyeOff } from 'lucide-react';

const LayerControls = ({ layers = [], onToggleLayer, colors }) => {
  return (
    <div style={{
      padding: '16px',
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      border: '1px solid #E5E7EB',
      marginBottom: '20px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px'
      }}>
        <Layers size={18} color={colors.primary} />
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          margin: 0,
          color: '#1F2937'
        }}>
          Map Layers
        </h3>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '12px'
      }}>
        {layers.map((layer) => (
          <div
            key={layer.id}
            onClick={() => onToggleLayer(layer.id)}
            style={{
              padding: '12px',
              backgroundColor: layer.visible ? '#F0F9FF' : '#F9FAFB',
              border: `1px solid ${layer.visible ? colors.primary : '#E5E7EB'}`,
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = layer.visible ? colors.primary : '#E5E7EB';
            }}
          >
            <span style={{
              fontSize: '14px',
              fontWeight: '500',
              color: '#1F2937'
            }}>
              {layer.name}
            </span>
            {layer.visible ? (
              <Eye size={16} color={colors.primary} />
            ) : (
              <EyeOff size={16} color="#9CA3AF" />
            )}
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '16px',
        paddingTop: '16px',
        borderTop: '1px solid #E5E7EB'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          {[
            { color: '#EF4444', label: 'Critical' },
            { color: '#F97316', label: 'High' },
            { color: '#FBBF24', label: 'Medium' },
            { color: '#10B981', label: 'Low' }
          ].map((item) => (
            <div key={item.label} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              color: '#6B7280'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                backgroundColor: item.color,
                borderRadius: '50%'
              }} />
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LayerControls;

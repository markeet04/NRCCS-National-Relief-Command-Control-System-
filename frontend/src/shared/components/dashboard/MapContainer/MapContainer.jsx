import PropTypes from 'prop-types';
import { MapPin, Maximize2 } from 'lucide-react';
import { useSettings } from '@app/providers/ThemeProvider';
import { getThemeColors } from '@shared/utils/themeColors';

/**
 * MapContainer Component
 * Container for flood risk maps with risk level legend
 * @param {Object} props - Component props
 * @param {string} props.title - Map title
 * @param {React.ReactNode} props.children - Map content (to be replaced with actual map)
 * @param {Function} props.onExpand - Expand to fullscreen handler
 * @param {Array} props.riskLevels - Risk level legend items
 */
const MapContainer = ({ 
  title = 'Flood Risk Map - Pakistan', 
  children, 
  onExpand,
  riskLevels = [
    { label: 'Critical', color: 'bg-red-500' },
    { label: 'High', color: 'bg-orange-500' },
    { label: 'Medium', color: 'bg-amber-500' },
    { label: 'Low', color: 'bg-blue-500' },
  ]
}) => {
  const { theme } = useSettings();
  const isLight = theme === 'light';
  const colors = getThemeColors(isLight);

  return (
    <div 
      className="rounded-xl overflow-hidden transition-all duration-300" 
      style={{ 
        background: isLight ? 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)' : colors.cardBg, 
        border: `1px solid ${isLight ? '#e2e8f0' : colors.cardBorder}`, 
        boxShadow: isLight ? '0 8px 32px rgba(0,0,0,0.08)' : 'none'
      }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between px-6 py-4" 
        style={{ 
          borderBottom: `1px solid ${isLight ? '#e2e8f0' : colors.cardBorder}`,
          background: isLight ? 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' : 'transparent'
        }}
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5" style={{ color: isLight ? '#0284c7' : colors.textMuted }} />
          <h2 className="text-lg font-semibold" style={{ color: colors.textPrimary }}>{title}</h2>
        </div>
        {onExpand && (
          <button
            onClick={onExpand}
            className="p-2 rounded-lg transition-all duration-200 hover:scale-105"
            style={{ 
              background: isLight ? 'rgba(2, 132, 199, 0.1)' : 'rgba(255,255,255,0.1)',
              color: isLight ? '#0284c7' : '#94a3b8'
            }}
            title="Expand map"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Map Content */}
      <div className="relative h-[500px]" style={{ backgroundColor: isLight ? '#e0f2fe' : '#0f172a' }}>
        {children || (
          <svg width="100%" height="100%" viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
            {/* Pakistan Map with Enhanced Heatmap */}
            <g>
              {/* Background */}
              <rect width="900" height="600" fill={isLight ? '#e0f2fe' : '#0f172a'} />
              
              {/* Accurate Pakistan map outline based on actual geography */}
              <path
                d="M 250 100
                   L 270 85 L 290 78 L 310 75 L 330 75 L 350 78
                   L 365 85 L 380 95 L 395 108 L 408 122
                   L 420 138 L 430 155 L 438 172 L 445 190
                   L 460 195 L 478 198 L 495 202 L 510 208
                   L 523 218 L 535 230 L 545 245 L 553 262
                   L 558 280 L 560 298 L 558 316 L 553 334
                   L 545 352 L 535 368 L 523 382 L 508 394
                   L 490 404 L 470 412 L 448 418 L 425 420
                   L 402 418 L 380 412 L 360 404 L 342 394
                   L 326 382 L 312 368 L 300 352 L 290 334
                   L 282 316 L 276 298 L 272 280 L 268 262
                   L 265 245 L 262 228 L 260 210 L 258 192
                   L 256 174 L 255 156 L 254 138 L 252 120
                   L 250 100 Z
                   M 245 135
                   L 235 145 L 225 158 L 218 172 L 213 188
                   L 210 205 L 208 222 L 207 238 L 208 254
                   L 210 268 L 215 280 L 222 290 L 232 298
                   L 245 304 L 260 308 L 275 310
                   M 285 315
                   L 270 318 L 255 322 L 242 328 L 232 336
                   L 225 346 L 220 358 L 218 372 L 220 386
                   L 225 398 L 233 408 L 245 416 L 260 422
                   L 278 426 L 298 428 L 318 428 L 338 426
                   L 356 422 L 372 416 L 386 408 L 398 398
                   L 408 386 L 415 372 L 418 358 L 418 344
                   L 415 330"
                fill="#1e293b"
                stroke="#94a3b8"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              
              {/* Provincial boundaries */}
              <path
                d="M 350 180 L 420 240 M 380 200 L 450 280 M 320 220 L 360 300 M 290 250 L 380 320"
                stroke="#334155"
                strokeWidth="1.5"
                strokeDasharray="4,4"
                opacity="0.6"
              />
              
              {/* Enhanced Heatmap regions - Critical (Red) - Southern Sindh/Karachi */}
              <ellipse cx="310" cy="410" rx="70" ry="60" fill="#dc2626" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.9;0.8" dur="3s" repeatCount="indefinite" />
                <animate attributeName="rx" values="70;75;70" dur="4s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="350" cy="390" rx="55" ry="48" fill="#ef4444" opacity="0.75">
                <animate attributeName="opacity" values="0.75;0.85;0.75" dur="2.5s" repeatCount="indefinite" />
              </ellipse>
              <circle cx="280" cy="385" r="40" fill="#b91c1c" opacity="0.7">
                <animate attributeName="r" values="40;45;40" dur="3.5s" repeatCount="indefinite" />
              </circle>
              
              {/* Flooding intensity indicators - flowing water effect */}
              <g opacity="0.6">
                <path 
                  d="M 250 380 Q 280 390 310 400 Q 340 410 370 400 Q 400 390 430 405" 
                  stroke="#60a5fa" 
                  strokeWidth="3" 
                  fill="none"
                  strokeDasharray="10,5"
                >
                  <animateTransform 
                    attributeName="transform" 
                    type="translate" 
                    values="0,0; 20,0; 0,0" 
                    dur="2s" 
                    repeatCount="indefinite"
                  />
                </path>
                <path 
                  d="M 260 400 Q 290 410 320 420 Q 350 430 380 420" 
                  stroke="#3b82f6" 
                  strokeWidth="2" 
                  fill="none"
                  strokeDasharray="8,4"
                >
                  <animateTransform 
                    attributeName="transform" 
                    type="translate" 
                    values="0,0; 15,0; 0,0" 
                    dur="1.5s" 
                    repeatCount="indefinite"
                  />
                </path>
              </g>
              
              {/* High Risk Areas (Orange) - Central/Eastern Sindh and Southern Punjab */}
              <ellipse cx="390" cy="340" rx="65" ry="57" fill="#ea580c" opacity="0.7">
                <animate attributeName="opacity" values="0.7;0.8;0.7" dur="3.5s" repeatCount="indefinite" />
              </ellipse>
              <ellipse cx="450" cy="310" rx="58" ry="50" fill="#f97316" opacity="0.65" />
              <circle cx="330" cy="320" r="48" fill="#c2410c" opacity="0.6" />
              
              {/* Medium Risk Areas (Yellow/Amber) - Punjab region */}
              <ellipse cx="420" cy="240" rx="60" ry="55" fill="#eab308" opacity="0.6" />
              <ellipse cx="360" cy="260" rx="52" ry="48" fill="#fbbf24" opacity="0.55" />
              <circle cx="480" cy="270" r="42" fill="#ca8a04" opacity="0.55" />
              <circle cx="380" cy="200" r="38" fill="#facc15" opacity="0.5" />
              
              {/* Low Risk Areas (Yellow-Green) - Northern Punjab */}
              <ellipse cx="340" cy="180" rx="48" ry="42" fill="#a3e635" opacity="0.5" />
              <circle cx="400" cy="160" r="38" fill="#84cc16" opacity="0.45" />
              
              {/* Very Low Risk Areas (Green) - Northern regions */}
              <ellipse cx="310" cy="130" rx="45" ry="40" fill="#22c55e" opacity="0.45" />
              <circle cx="360" cy="110" r="35" fill="#16a34a" opacity="0.42" />
              <circle cx="280" cy="160" r="33" fill="#15803d" opacity="0.4" />
              
              {/* Major cities with enhanced styling */}
              <g id="cities">
                {/* Karachi - largest city, southern coast */}
                <circle cx="310" cy="410" r="7" fill="#ffffff" stroke="#000000" strokeWidth="2" />
                <circle cx="310" cy="410" r="12" fill="none" stroke="#dc2626" strokeWidth="2" opacity="0.6">
                  <animate attributeName="r" values="12;18;12" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
                </circle>
                <text x="322" y="416" fill="#ffffff" fontSize="14" fontWeight="700" stroke="#0f172a" strokeWidth="0.5" paintOrder="stroke">Karachi</text>
                
                {/* Hyderabad - northeast of Karachi */}
                <circle cx="350" cy="380" r="5.5" fill="#ffffff" stroke="#000000" strokeWidth="2" />
                <circle cx="350" cy="380" r="10" fill="none" stroke="#ea580c" strokeWidth="1.5" opacity="0.5">
                  <animate attributeName="r" values="10;15;10" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <text x="360" y="385" fill="#ffffff" fontSize="12" fontWeight="600" stroke="#0f172a" strokeWidth="0.5" paintOrder="stroke">Hyderabad</text>
                
                {/* Sukkur - northern Sindh */}
                <circle cx="360" cy="320" r="5.5" fill="#ffffff" stroke="#000000" strokeWidth="2" />
                <text x="370" y="325" fill="#ffffff" fontSize="12" fontWeight="600" stroke="#0f172a" strokeWidth="0.5" paintOrder="stroke">Sukkur</text>
                
                {/* Multan - southern Punjab */}
                <circle cx="420" cy="260" r="6" fill="#ffffff" stroke="#000000" strokeWidth="2" />
                <text x="432" y="265" fill="#ffffff" fontSize="13" fontWeight="600" stroke="#0f172a" strokeWidth="0.5" paintOrder="stroke">Multan</text>
                
                {/* Lahore - eastern Punjab, near border */}
                <circle cx="480" cy="210" r="7" fill="#ffffff" stroke="#000000" strokeWidth="2" />
                <text x="492" y="216" fill="#ffffff" fontSize="14" fontWeight="700" stroke="#0f172a" strokeWidth="0.5" paintOrder="stroke">Lahore</text>
                
                {/* Faisalabad - central Punjab */}
                <circle cx="430" cy="220" r="5.5" fill="#ffffff" stroke="#000000" strokeWidth="2" />
                <text x="440" y="225" fill="#ffffff" fontSize="12" fontWeight="600" stroke="#0f172a" strokeWidth="0.5" paintOrder="stroke">Faisalabad</text>
                
                {/* Islamabad/Rawalpindi - northern Punjab */}
                <circle cx="380" cy="160" r="6.5" fill="#ffffff" stroke="#000000" strokeWidth="2" />
                <text x="392" y="166" fill="#ffffff" fontSize="13" fontWeight="700" stroke="#0f172a" strokeWidth="0.5" paintOrder="stroke">Islamabad</text>
                
                {/* Peshawar - KPK */}
                <circle cx="320" cy="120" r="6" fill="#ffffff" stroke="#000000" strokeWidth="2" />
                <text x="332" y="126" fill="#ffffff" fontSize="13" fontWeight="600" stroke="#0f172a" strokeWidth="0.5" paintOrder="stroke">Peshawar</text>
                
                {/* Quetta - Balochistan */}
                <circle cx="240" cy="240" r="6" fill="#ffffff" stroke="#000000" strokeWidth="2" />
                <text x="252" y="246" fill="#ffffff" fontSize="13" fontWeight="600" stroke="#0f172a" strokeWidth="0.5" paintOrder="stroke">Quetta</text>
              </g>
              
              {/* Water bodies and rivers */}
              <g opacity="0.4">
                <path 
                  d="M 200 200 Q 250 220 300 200 Q 350 180 400 200 Q 450 220 500 200" 
                  stroke="#0ea5e9" 
                  strokeWidth="3" 
                  fill="none"
                />
                <path 
                  d="M 300 150 Q 320 180 340 200 Q 360 220 380 250 Q 400 280 420 310" 
                  stroke="#06b6d4" 
                  strokeWidth="2" 
                  fill="none"
                />
              </g>
              
              {/* Enhanced border highlight with glow effect */}
              <path
                d="M 250 100
                   L 270 85 L 290 78 L 310 75 L 330 75 L 350 78
                   L 365 85 L 380 95 L 395 108 L 408 122
                   L 420 138 L 430 155 L 438 172 L 445 190
                   L 460 195 L 478 198 L 495 202 L 510 208
                   L 523 218 L 535 230 L 545 245 L 553 262
                   L 558 280 L 560 298 L 558 316 L 553 334
                   L 545 352 L 535 368 L 523 382 L 508 394
                   L 490 404 L 470 412 L 448 418 L 425 420
                   L 402 418 L 380 412 L 360 404 L 342 394
                   L 326 382 L 312 368 L 300 352 L 290 334
                   L 282 316 L 276 298 L 272 280 L 268 262
                   L 265 245 L 262 228 L 260 210 L 258 192
                   L 256 174 L 255 156 L 254 138 L 252 120
                   L 250 100 Z
                   M 245 135
                   L 235 145 L 225 158 L 218 172 L 213 188
                   L 210 205 L 208 222 L 207 238 L 208 254
                   L 210 268 L 215 280 L 222 290 L 232 298
                   L 245 304 L 260 308 L 275 310
                   M 285 315
                   L 270 318 L 255 322 L 242 328 L 232 336
                   L 225 346 L 220 358 L 218 372 L 220 386
                   L 225 398 L 233 408 L 245 416 L 260 422
                   L 278 426 L 298 428 L 318 428 L 338 426
                   L 356 422 L 372 416 L 386 408 L 398 398
                   L 408 386 L 415 372 L 418 358 L 418 344
                   L 415 330"
                fill="none"
                stroke="#86efac"
                strokeWidth="2"
                opacity="0.3"
              />
              <path
                d="M 250 100
                   L 270 85 L 290 78 L 310 75 L 330 75 L 350 78
                   L 365 85 L 380 95 L 395 108 L 408 122
                   L 420 138 L 430 155 L 438 172 L 445 190
                   L 460 195 L 478 198 L 495 202 L 510 208
                   L 523 218 L 535 230 L 545 245 L 553 262
                   L 558 280 L 560 298 L 558 316 L 553 334
                   L 545 352 L 535 368 L 523 382 L 508 394
                   L 490 404 L 470 412 L 448 418 L 425 420
                   L 402 418 L 380 412 L 360 404 L 342 394
                   L 326 382 L 312 368 L 300 352 L 290 334
                   L 282 316 L 276 298 L 272 280 L 268 262
                   L 265 245 L 262 228 L 260 210 L 258 192
                   L 256 174 L 255 156 L 254 138 L 252 120
                   L 250 100 Z
                   M 245 135
                   L 235 145 L 225 158 L 218 172 L 213 188
                   L 210 205 L 208 222 L 207 238 L 208 254
                   L 210 268 L 215 280 L 222 290 L 232 298
                   L 245 304 L 260 308 L 275 310
                   M 285 315
                   L 270 318 L 255 322 L 242 328 L 232 336
                   L 225 346 L 220 358 L 218 372 L 220 386
                   L 225 398 L 233 408 L 245 416 L 260 422
                   L 278 426 L 298 428 L 318 428 L 338 426
                   L 356 422 L 372 416 L 386 408 L 398 398
                   L 408 386 L 415 372 L 418 358 L 418 344
                   L 415 330"
                fill="none"
                stroke="#ffffff"
                strokeWidth="0.5"
                opacity="0.6"
              />
            </g>
          </svg>
        )}

        {/* Risk Level Legend */}
        <div className="absolute bottom-6 right-6 rounded-lg shadow-lg p-4" style={{ backgroundColor: '#1a1f2e', border: '1px solid rgba(148, 163, 184, 0.15)' }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Risk Levels</h3>
          <div className="space-y-2">
            {riskLevels.map((level, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${level.color}`} />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{level.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

MapContainer.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  onExpand: PropTypes.func,
  riskLevels: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ),
};

export default MapContainer;

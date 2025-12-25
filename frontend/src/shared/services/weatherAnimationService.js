/**
 * Weather Animation Service
 * 
 * Progressive enhancement weather visualization:
 * - WebGL Mode: Smooth particle-based animations for wind, rain, snow
 * - TimeSlider Mode: Fallback using time-enabled raster layers
 * 
 * Uses ArcGIS JS API 4.33 and Open-Meteo for real-time weather data.
 */

import { getAnimationMode } from '../utils/webglDetection';

// ============================================================================
// CONFIGURATION
// ============================================================================

const ANIMATION_CONFIG = {
    // Particle counts for different performance levels
    particles: {
        webgl: { wind: 200, rain: 400, snow: 300 },
        'webgl-lite': { wind: 100, rain: 200, snow: 150 },
        timeslider: { wind: 0, rain: 0, snow: 0 }
    },

    // Animation frame rates
    fps: {
        webgl: 60,
        'webgl-lite': 30,
        timeslider: 1
    },

    // Auto-refresh interval (ms)
    autoRefreshInterval: 10 * 60 * 1000, // 10 minutes

    // Weather raster layer URLs (for TimeSlider fallback)
    rasterLayers: {
        precipitation: 'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0q.cgi',
        wind: 'https://nowcoast.noaa.gov/arcgis/services/nowcoast/forecast_meteoceanhydro_sfc_ndfd_windspd_offsets/MapServer/WMSServer',
        temperature: 'https://nowcoast.noaa.gov/arcgis/services/nowcoast/forecast_meteoceanhydro_sfc_ndfd_temp_offsets/MapServer/WMSServer'
    }
};

// ============================================================================
// ANIMATION STATE
// ============================================================================

class WeatherAnimationService {
    constructor() {
        this.mode = 'detecting';
        this.modeDetails = null;
        this.isAnimating = false;
        this.animationFrame = null;
        this.particles = { wind: [], rain: [], snow: [] };
        this.weatherData = null;
        this.canvas = null;
        this.ctx = null;
        this.bounds = null;
        this.listeners = [];
        this.autoRefreshTimer = null;
    }

    /**
     * Initialize the animation service
     * @returns {Promise<Object>} Mode details
     */
    async initialize() {
        console.log('🌦️ Initializing Weather Animation Service...');

        try {
            this.modeDetails = await getAnimationMode();
            this.mode = this.modeDetails.recommendedMode;

            console.log(`✓ Animation Mode: ${this.mode.toUpperCase()}`);
            this.notifyListeners('modeChanged', { mode: this.mode, details: this.modeDetails });

            return this.modeDetails;
        } catch (error) {
            console.error('Animation service init failed:', error);
            this.mode = 'timeslider';
            return { recommendedMode: 'timeslider', error: error.message };
        }
    }

    /**
     * Get current animation mode
     * @returns {Object} Current mode info
     */
    getMode() {
        return {
            mode: this.mode,
            isWebGL: this.mode === 'webgl' || this.mode === 'webgl-lite',
            label: this.mode === 'webgl' || this.mode === 'webgl-lite'
                ? '⚡ WebGL Mode'
                : '⏱ Time-Based Mode',
            details: this.modeDetails
        };
    }

    /**
     * Subscribe to mode changes
     * @param {Function} callback - Callback function
     */
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    notifyListeners(event, data) {
        this.listeners.forEach(cb => cb(event, data));
    }

    // ============================================================================
    // WEBGL PARTICLE ANIMATIONS
    // ============================================================================

    /**
     * Start WebGL-based particle animations
     * @param {HTMLCanvasElement} canvas - Canvas element for rendering
     * @param {Object} bounds - Geographic bounds {minLon, minLat, maxLon, maxLat}
     * @param {Object} weatherData - Current weather data
     */
    startWebGLAnimation(canvas, bounds, weatherData) {
        if (this.mode === 'timeslider') {
            console.warn('WebGL not available, use TimeSlider mode');
            return false;
        }

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.bounds = bounds;
        this.weatherData = weatherData;

        // Resize canvas
        this.resizeCanvas();

        // Initialize particles
        this.initializeParticles();

        // Start animation loop
        this.isAnimating = true;
        this.animate();

        console.log('✓ WebGL Animation Started');
        return true;
    }

    resizeCanvas() {
        if (!this.canvas) return;
        const rect = this.canvas.parentElement?.getBoundingClientRect();
        if (rect) {
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
        }
    }

    initializeParticles() {
        const config = ANIMATION_CONFIG.particles[this.mode] || ANIMATION_CONFIG.particles['webgl-lite'];
        const width = this.canvas?.width || 800;
        const height = this.canvas?.height || 600;

        // Wind particles
        this.particles.wind = Array.from({ length: config.wind }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            speed: 1 + Math.random() * 2,
            size: 1 + Math.random() * 1.5,
            alpha: 0.3 + Math.random() * 0.5,
            trail: []
        }));

        // Rain particles
        const precipitation = this.weatherData?.current?.precipitation || 0;
        const rainCount = Math.min(config.rain, Math.floor(config.rain * (precipitation / 10 + 0.5)));

        this.particles.rain = Array.from({ length: rainCount }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            speed: 8 + Math.random() * 6,
            length: 10 + Math.random() * 15,
            alpha: 0.4 + Math.random() * 0.4
        }));

        // Snow particles (if temperature < 2°C)
        const temp = this.weatherData?.current?.temperature || 20;
        if (temp < 2) {
            this.particles.snow = Array.from({ length: config.snow }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                speed: 1 + Math.random() * 2,
                size: 2 + Math.random() * 3,
                wobble: Math.random() * Math.PI * 2,
                alpha: 0.6 + Math.random() * 0.4
            }));
        } else {
            this.particles.snow = [];
        }
    }

    animate() {
        if (!this.isAnimating || !this.ctx || !this.canvas) return;

        const ctx = this.ctx;
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Clear with slight transparency for trail effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, width, height);

        // Get wind direction
        const windDir = this.weatherData?.current?.windDirection || 0;
        const windSpeed = this.weatherData?.current?.windSpeed || 5;
        const windAngle = ((windDir + 180) % 360) * (Math.PI / 180);

        // Animate wind particles
        this.animateWind(ctx, width, height, windAngle, windSpeed);

        // Animate rain
        this.animateRain(ctx, width, height, windAngle);

        // Animate snow
        this.animateSnow(ctx, width, height);

        // Next frame
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    animateWind(ctx, width, height, windAngle, windSpeed) {
        const speedFactor = 0.5 + (windSpeed / 50);

        this.particles.wind.forEach(p => {
            // Store trail
            p.trail.push({ x: p.x, y: p.y });
            if (p.trail.length > 8) p.trail.shift();

            // Move particle
            p.x += Math.sin(windAngle) * p.speed * speedFactor;
            p.y -= Math.cos(windAngle) * p.speed * speedFactor;

            // Wrap around
            if (p.x > width) p.x = 0;
            if (p.x < 0) p.x = width;
            if (p.y > height) p.y = 0;
            if (p.y < 0) p.y = height;

            // Draw trail
            if (p.trail.length > 2) {
                ctx.beginPath();
                ctx.moveTo(p.trail[0].x, p.trail[0].y);
                p.trail.forEach(t => ctx.lineTo(t.x, t.y));
                ctx.strokeStyle = `rgba(100, 200, 255, ${p.alpha * 0.5})`;
                ctx.lineWidth = p.size * 0.5;
                ctx.stroke();
            }

            // Draw head
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(150, 220, 255, ${p.alpha})`;
            ctx.fill();
        });
    }

    animateRain(ctx, width, height, windAngle) {
        const windOffset = Math.sin(windAngle) * 0.3;

        this.particles.rain.forEach(p => {
            // Move down with wind offset
            p.y += p.speed;
            p.x += windOffset * p.speed;

            // Reset at bottom
            if (p.y > height) {
                p.y = -p.length;
                p.x = Math.random() * width;
            }
            if (p.x > width) p.x = 0;
            if (p.x < 0) p.x = width;

            // Draw raindrop
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x + windOffset * 5, p.y + p.length);
            ctx.strokeStyle = `rgba(120, 180, 255, ${p.alpha})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        });
    }

    animateSnow(ctx, width, height) {
        this.particles.snow.forEach(p => {
            // Gentle falling with wobble
            p.wobble += 0.02;
            p.y += p.speed;
            p.x += Math.sin(p.wobble) * 0.5;

            // Reset at bottom
            if (p.y > height) {
                p.y = -p.size;
                p.x = Math.random() * width;
            }

            // Draw snowflake
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
            ctx.fill();
        });
    }

    /**
     * Stop animations
     */
    stopAnimation() {
        this.isAnimating = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        console.log('⏹ Animation Stopped');
    }

    /**
     * Update weather data and refresh particles
     * @param {Object} weatherData - New weather data
     */
    updateWeatherData(weatherData) {
        this.weatherData = weatherData;
        if (this.isAnimating) {
            this.initializeParticles();
        }
        this.notifyListeners('weatherUpdated', weatherData);
    }

    // ============================================================================
    // TIMESLIDER FALLBACK
    // ============================================================================

    /**
     * Get TimeSlider configuration for fallback mode
     * @returns {Object} TimeSlider config
     */
    getTimeSliderConfig() {
        const now = new Date();
        const startTime = new Date(now.getTime() - 6 * 60 * 60 * 1000); // 6 hours ago
        const endTime = new Date(now.getTime() + 6 * 60 * 60 * 1000); // 6 hours ahead

        return {
            mode: 'time-window',
            fullTimeExtent: {
                start: startTime,
                end: endTime
            },
            timeExtent: {
                start: new Date(now.getTime() - 30 * 60 * 1000), // 30 min ago
                end: now
            },
            stops: {
                interval: {
                    value: 15,
                    unit: 'minutes'
                }
            },
            playRate: 1000, // 1 second per step
            loop: true
        };
    }

    /**
     * Get weather raster layer configurations for TimeSlider mode
     * @returns {Array} Layer configurations
     */
    getWeatherRasterLayers() {
        return [
            {
                id: 'precipitation-radar',
                title: 'Precipitation Radar',
                url: ANIMATION_CONFIG.rasterLayers.precipitation,
                type: 'WMSLayer',
                sublayers: [{ name: 'nexrad-n0q-900913' }],
                visible: true,
                opacity: 0.7,
                timeEnabled: true
            }
        ];
    }

    /**
     * Start auto-refresh timer
     * @param {Function} refreshCallback - Function to call on refresh
     */
    startAutoRefresh(refreshCallback) {
        this.stopAutoRefresh();
        this.autoRefreshTimer = setInterval(() => {
            console.log('🔄 Auto-refreshing weather data...');
            if (refreshCallback) refreshCallback();
        }, ANIMATION_CONFIG.autoRefreshInterval);
    }

    stopAutoRefresh() {
        if (this.autoRefreshTimer) {
            clearInterval(this.autoRefreshTimer);
            this.autoRefreshTimer = null;
        }
    }

    /**
     * Cleanup service
     */
    destroy() {
        this.stopAnimation();
        this.stopAutoRefresh();
        this.listeners = [];
        console.log('🧹 Weather Animation Service destroyed');
    }
}

// Singleton instance
const weatherAnimationService = new WeatherAnimationService();

export default weatherAnimationService;
export { WeatherAnimationService, ANIMATION_CONFIG };

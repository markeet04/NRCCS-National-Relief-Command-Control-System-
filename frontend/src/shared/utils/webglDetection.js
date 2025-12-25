/**
 * WebGL Detection Utility
 * 
 * Detects WebGL support and performance capabilities for weather animations.
 * Used by the weather animation system to determine rendering mode.
 */

/**
 * Check if WebGL is supported in the browser
 * @returns {Object} WebGL support information
 */
export const detectWebGLSupport = () => {
    const result = {
        supported: false,
        version: null,
        renderer: null,
        vendor: null,
        maxTextureSize: 0,
        performanceScore: 0,
        recommendedMode: 'timeslider' // Default fallback
    };

    try {
        // Create test canvas
        const canvas = document.createElement('canvas');

        // Try WebGL2 first (better performance)
        let gl = canvas.getContext('webgl2');
        if (gl) {
            result.version = 2;
        } else {
            // Fallback to WebGL1
            gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                result.version = 1;
            }
        }

        if (gl) {
            result.supported = true;

            // Get renderer info
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                result.renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                result.vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            }

            // Get max texture size (indicator of GPU capability)
            result.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

            // Calculate performance score (0-100)
            result.performanceScore = calculatePerformanceScore(result);

            // Recommend mode based on performance
            if (result.performanceScore >= 50) {
                result.recommendedMode = 'webgl';
            } else if (result.performanceScore >= 30) {
                result.recommendedMode = 'webgl-lite'; // Reduced particle count
            } else {
                result.recommendedMode = 'timeslider';
            }
        }
    } catch (e) {
        console.warn('WebGL detection failed:', e);
    }

    return result;
};

/**
 * Calculate performance score based on GPU capabilities
 * @param {Object} info - WebGL info object
 * @returns {number} Score from 0-100
 */
const calculatePerformanceScore = (info) => {
    let score = 0;

    // WebGL2 gets bonus points
    if (info.version === 2) score += 30;
    else if (info.version === 1) score += 15;

    // Texture size scoring
    if (info.maxTextureSize >= 16384) score += 40;
    else if (info.maxTextureSize >= 8192) score += 30;
    else if (info.maxTextureSize >= 4096) score += 20;
    else if (info.maxTextureSize >= 2048) score += 10;

    // Known high-performance GPUs get bonus
    const renderer = (info.renderer || '').toLowerCase();
    if (renderer.includes('nvidia') || renderer.includes('radeon') || renderer.includes('geforce')) {
        score += 20;
    } else if (renderer.includes('intel') && !renderer.includes('hd graphics 4')) {
        score += 10;
    }

    // Known low-performance indicators
    if (renderer.includes('swiftshader') || renderer.includes('software')) {
        score = Math.max(0, score - 50);
    }

    return Math.min(100, score);
};

/**
 * Run a quick performance benchmark
 * @returns {Promise<Object>} Benchmark results
 */
export const runPerformanceBenchmark = async () => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;

        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (!gl) {
            resolve({ fps: 0, passed: false });
            return;
        }

        let frameCount = 0;
        const startTime = performance.now();
        const duration = 500; // 500ms benchmark

        const render = () => {
            // Simple draw operation
            gl.clearColor(Math.random(), Math.random(), Math.random(), 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            frameCount++;

            if (performance.now() - startTime < duration) {
                requestAnimationFrame(render);
            } else {
                const fps = (frameCount / duration) * 1000;
                resolve({
                    fps: Math.round(fps),
                    passed: fps >= 30, // 30 FPS minimum for smooth animations
                    frameCount
                });
            }
        };

        requestAnimationFrame(render);
    });
};

/**
 * Get the recommended animation mode
 * @returns {Promise<Object>} Mode recommendation with details
 */
export const getAnimationMode = async () => {
    const webglInfo = detectWebGLSupport();

    // If WebGL looks good, run a quick benchmark to confirm
    if (webglInfo.recommendedMode === 'webgl' || webglInfo.recommendedMode === 'webgl-lite') {
        const benchmark = await runPerformanceBenchmark();

        if (!benchmark.passed) {
            webglInfo.recommendedMode = 'timeslider';
            webglInfo.benchmarkFailed = true;
        }

        webglInfo.benchmark = benchmark;
    }

    console.log('🎮 Animation Mode Detection:', webglInfo);
    return webglInfo;
};

export default {
    detectWebGLSupport,
    runPerformanceBenchmark,
    getAnimationMode
};

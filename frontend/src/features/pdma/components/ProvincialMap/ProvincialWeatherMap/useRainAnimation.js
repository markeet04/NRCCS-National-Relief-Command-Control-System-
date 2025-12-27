/**
 * useRainAnimation Hook
 * Handles rain animation canvas logic
 */
import { useRef, useCallback } from 'react';

export const useRainAnimation = (weatherData) => {
    const rainCanvasRef = useRef(null);
    const rainAnimationRef = useRef(null);

    const startRainAnimation = useCallback(() => {
        const canvas = rainCanvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // Determine rain intensity from weather data
        const rainIntensity = weatherData?.current?.precipitation || 0;
        const dropCount = Math.min(Math.max(Math.floor(rainIntensity * 20), 50), 300);

        const drops = Array.from({ length: dropCount }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            length: Math.random() * 20 + 10,
            speed: Math.random() * 5 + 3
        }));

        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = 'rgba(174, 194, 224, 0.5)';
            ctx.lineWidth = 1;
            ctx.lineCap = 'round';

            drops.forEach(drop => {
                ctx.beginPath();
                ctx.moveTo(drop.x, drop.y);
                ctx.lineTo(drop.x, drop.y + drop.length);
                ctx.stroke();

                drop.y += drop.speed;
                if (drop.y > canvas.height) {
                    drop.y = -drop.length;
                    drop.x = Math.random() * canvas.width;
                }
            });
            rainAnimationRef.current = requestAnimationFrame(animate);
        };

        animate();
    }, [weatherData]);

    const stopRainAnimation = useCallback(() => {
        if (rainAnimationRef.current) {
            cancelAnimationFrame(rainAnimationRef.current);
            rainAnimationRef.current = null;
        }
        const canvas = rainCanvasRef.current;
        if (canvas) {
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        }
    }, []);

    return {
        rainCanvasRef,
        startRainAnimation,
        stopRainAnimation
    };
};

export default useRainAnimation;

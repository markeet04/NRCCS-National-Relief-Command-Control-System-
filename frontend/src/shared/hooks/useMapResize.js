/**
 * useMapResize Hook
 * 
 * Provides ResizeObserver-based container monitoring for ArcGIS MapView
 * Automatically calls view.resize() when container dimensions change
 * 
 * WHY THIS IS CRITICAL FOR PREVENTING BLURRINESS:
 * - When sidebar toggles or container resizes, canvas size changes
 * - Without resize(), WebGL renders at wrong resolution causing blur
 * - ResizeObserver detects all dimension changes (sidebar, fullscreen, etc.)
 * 
 * USAGE:
 * const { containerRef } = useMapResize(viewRef);
 * <div ref={containerRef}>...</div>
 */

import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook to handle map container resize events
 * @param {React.RefObject} viewRef - Reference to ArcGIS MapView
 * @returns {Object} { containerRef } - Ref to attach to map container
 */
export const useMapResize = (viewRef) => {
    const containerRef = useRef(null);
    const resizeObserverRef = useRef(null);
    const resizeTimeoutRef = useRef(null);

    // Debounced resize handler to avoid excessive resize calls
    const handleResize = useCallback(() => {
        if (resizeTimeoutRef.current) {
            clearTimeout(resizeTimeoutRef.current);
        }

        resizeTimeoutRef.current = setTimeout(() => {
            const view = viewRef.current;
            if (view && typeof view.resize === 'function') {
                view.resize();
                console.log('🔄 MapView resized for crisp rendering');
            }
        }, 100); // 100ms debounce
    }, [viewRef]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Create ResizeObserver to detect container dimension changes
        resizeObserverRef.current = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.target === container) {
                    handleResize();
                }
            }
        });

        // Start observing
        resizeObserverRef.current.observe(container);
        console.log('✓ ResizeObserver attached to map container');

        // Cleanup
        return () => {
            if (resizeObserverRef.current) {
                resizeObserverRef.current.disconnect();
            }
            if (resizeTimeoutRef.current) {
                clearTimeout(resizeTimeoutRef.current);
            }
        };
    }, [handleResize]);

    // Manual resize trigger for programmatic resizes
    const triggerResize = useCallback(() => {
        handleResize();
    }, [handleResize]);

    return {
        containerRef,
        triggerResize
    };
};

/**
 * Inline resize handler for class components or when hook cannot be used
 * Call this in useEffect after view is created
 * 
 * @param {HTMLElement} container - Map container element
 * @param {MapView} view - ArcGIS MapView instance
 * @returns {Function} Cleanup function
 */
export const attachMapResizeObserver = (container, view) => {
    if (!container || !view) return () => { };

    let timeoutId = null;

    const observer = new ResizeObserver(() => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            if (view && typeof view.resize === 'function') {
                view.resize();
            }
        }, 100);
    });

    observer.observe(container);
    console.log('✓ ResizeObserver attached to map container');

    return () => {
        observer.disconnect();
        if (timeoutId) clearTimeout(timeoutId);
    };
};

export default useMapResize;

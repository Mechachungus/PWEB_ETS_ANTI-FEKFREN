document.addEventListener("DOMContentLoaded", function() {
    const header = document.querySelector(".minimal-header");
    const theSun = document.getElementById("the-sun");

    // Define the sun's journey parameters
    const SUN_END_SCROLL_FACTOR = 0.9; // Sun ends journey at 90% of scrollable height
    
    // START/END positions are INSIDE the viewport
    const SUN_START_X_VW = 80; // Start at 95% from left (bottom-right)
    const SUN_END_X_VW = 0;   // End at 5% from left (bottom-left)
    
    const SUN_START_Y_VH = 80; // Start/End at 80vh from top (near bottom)
    const SUN_PEAK_Y_VH = 20;  // Peak at 20vh from top (near top)

    // Color conversion helpers
    const sunInitialColorRgb = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--sun-initial-color').trim());
    const sunFinalColorRgb = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--sun-final-color').trim());

    function interpolateColor(color1, color2, factor) {
        const result = color1.slice();
        for (let i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - result[i]));
        }
        return `rgb(${result.join(',')})`;
    }

    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        return [ (bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255 ];
    }

    // --- Main Scroll event handler ---
    function handleScroll() {
        const scrollY = window.scrollY;
        const totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const sunEndScroll = totalScrollableHeight * SUN_END_SCROLL_FACTOR;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Header scroll logic
        if (scrollY > 10) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // --- Sun Movement Logic ---

        // Calculate scroll progress
        let scrollProgress = scrollY / sunEndScroll;
        
        // CRITICAL: Clamp progress between 0 and 1.
        // This stops the sun from scrolling off-screen when you scroll past the "end".
        scrollProgress = Math.min(1, Math.max(0, scrollProgress)); 
        
        // Sun is ALWAYS visible
        theSun.style.opacity = 1; 

        // 1. Calculate X position (East to West)
        const sunStartX = viewportWidth * (SUN_START_X_VW / 100);
        const sunEndX = viewportWidth * (SUN_END_X_VW / 100);
        const sunX = sunStartX - (scrollProgress * (sunStartX - sunEndX));
        
        // 2. Calculate Y position (Parabolic Arc)
        const peakY = viewportHeight * (SUN_PEAK_Y_VH / 100);
        const startY = viewportHeight * (SUN_START_Y_VH / 100);
        const arcAmplitude = startY - peakY;
        
        // Parabolic factor: ( -4 * (x-0.5)^2 + 1 ) gives a 0 -> 1 -> 0 curve
        const parabolicFactor = -4 * Math.pow(scrollProgress - 0.5, 2) + 1;
        
        // Apply the factor to the amplitude
        const sunY = startY - (parabolicFactor * arcAmplitude);

        theSun.style.left = `${sunX}px`;
        theSun.style.top = `${sunY}px`;

        // 3. Interpolate sun color
        const currentColor = interpolateColor(sunInitialColorRgb, sunFinalColorRgb, scrollProgress);
        
        // Update gradient and shadow for the "shine"
        const currentGlow = currentColor.replace('rgb', 'rgba').replace(')', ', 0.5)');
        theSun.style.background = `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 15%, ${currentColor} 40%, ${currentColor} 60%, ${currentGlow} 80%, rgba(255, 204, 0, 0) 100%)`;
        theSun.style.boxShadow = `0 0 60px 20px ${currentColor}, 0 0 100px 40px ${currentGlow}`;

        // 4. REMOVED all logic for hiding the sun at the footer.
    }

    // Initial call to set sun position at page load
    handleScroll();

    // Add event listeners
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll); // Recalculate on resize
});
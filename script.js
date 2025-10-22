document.addEventListener("DOMContentLoaded", function() {
    const header = document.querySelector(".minimal-header");
    const theSun = document.getElementById("the-sun");

    // Define the sun's journey parameters
    const SUN_END_SCROLL_FACTOR = 0.9; 
    
    // ✅ Using your new values
    const SUN_START_X_VW = 80; // Start at 80% from left
    const SUN_END_X_VW = -5;   // End at -5% from left (off-screen)
    
    const SUN_START_Y_VH = 80; 
    const SUN_PEAK_Y_VH = 20;  

    // Color conversion helpers
    const sunInitialColorRgb = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--sun-initial-color').trim());
    const sunFinalColorRgb = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--sun-final-color').trim());

    // ✅ NEW: Get the Page Background colors
    const bgInitialColorRgb = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--bg-initial-color').trim());
    const bgFinalColorRgb = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--bg-final-color').trim());


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

        if (scrollY > 10) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // Calculate scroll progress
        let scrollProgress = scrollY / sunEndScroll;
        
        // CRITICAL: Clamp progress between 0 and 1.
        scrollProgress = Math.min(1, Math.max(0, scrollProgress)); 
        
        theSun.style.opacity = 1; 

        // 1. Calculate X position (East to West)
        const sunStartX = viewportWidth * (SUN_START_X_VW / 100);
        const sunEndX = viewportWidth * (SUN_END_X_VW / 100);
        const sunX = sunStartX - (scrollProgress * (sunStartX - sunEndX));
        
        // 2. Calculate Y position (Parabolic Arc)
        const peakY = viewportHeight * (SUN_PEAK_Y_VH / 100);
        const startY = viewportHeight * (SUN_START_Y_VH / 100);
        const arcAmplitude = startY - peakY;
        const parabolicFactor = -4 * Math.pow(scrollProgress - 0.5, 2) + 1;
        const sunY = startY - (parabolicFactor * arcAmplitude);

        theSun.style.left = `${sunX}px`;
        theSun.style.top = `${sunY}px`;

        // 3. Interpolate sun orb color
        const currentColor = interpolateColor(sunInitialColorRgb, sunFinalColorRgb, scrollProgress);
        
        // 4. ✅ NEW: Interpolate PAGE BACKGROUND color
        const currentBgColor = interpolateColor(bgInitialColorRgb, bgFinalColorRgb, scrollProgress);
        
        // 5. ✅ NEW: Apply the new background color to the whole page
        document.body.style.backgroundColor = currentBgColor;

        // 6. Update gradient and shadow for the sun orb
        const currentGlow = currentColor.replace('rgb', 'rgba').replace(')', ', 0.5)');
        
        // ✅ UPDATED: Brighter gradient and shadow
        theSun.style.background = `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 20%, ${currentColor} 50%, ${currentGlow} 80%, rgba(255, 204, 0, 0) 100%)`;
        theSun.style.boxShadow = `0 0 80px 30px ${currentColor}, 0 0 140px 60px ${currentGlow.replace('0.5', '0.4')}`;
    }

    // Initial call to set sun position at page load
    handleScroll();
    
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
});
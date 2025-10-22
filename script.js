document.addEventListener("DOMContentLoaded", function() {
    const header = document.querySelector(".minimal-header");
    const theSun = document.getElementById("the-sun");
    const mainFooter = document.getElementById("main-footer");

    // Define the sun's journey parameters
    const SUN_END_SCROLL_FACTOR = 0.8; // Sun ends journey at 80% of scrollable height
    const SUN_START_Y_VH = 80; // Start at 80vh from top (near bottom)
    const SUN_PEAK_Y_VH = 20; // Peak at 20vh from top (near top)

    const sunInitialColorRgb = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--sun-initial-color').trim());
    const sunFinalColorRgb = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--sun-final-color').trim());

    // --- Helper for color interpolation (RGB) ---
    function interpolateColor(color1, color2, factor) {
        const result = color1.slice();
        for (let i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - result[i]));
        }
        return `rgb(${result.join(',')})`;
    }

    // Convert hex to RGB array
    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        return [ (bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255 ];
    }

    // --- Scroll event handler ---
    function handleScroll() {
        const scrollY = window.scrollY;
        const totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const sunEndScroll = totalScrollableHeight * SUN_END_SCROLL_FACTOR;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Header scroll logic (remains the same, but we don't need .scrolled)
        // You can keep this if you want the shadow, or remove it.
        // Let's keep it for the shadow.
        if (scrollY > 10) { // Add shadow almost immediately
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // Sun movement logic
        if (scrollY >= 0 && scrollY <= sunEndScroll) {
            theSun.style.opacity = 1; 
            
            let scrollProgress = scrollY / sunEndScroll;
            scrollProgress = Math.min(1, Math.max(0, scrollProgress)); // Clamp 0-1

            // 1. Calculate X position (East to West)
            // Moves from 110% (off-screen right) to -10% (off-screen left)
            const sunX = viewportWidth * (1.1 - (scrollProgress * 1.2));
            
            // 2. ✅ Calculate Y position (Parabolic Arc)
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
            
            // ✅ Update gradient and shadow for the "shine"
            const currentGlow = currentColor.replace('rgb', 'rgba').replace(')', ', 0.5)');
            theSun.style.background = `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 15%, ${currentColor} 40%, ${currentColor} 60%, ${currentGlow} 80%, rgba(255, 204, 0, 0) 100%)`;
            theSun.style.boxShadow = `0 0 60px 20px ${currentColor}, 0 0 100px 40px ${currentGlow}`;


            // 4. Hide sun when it hits the footer
            const sunRect = theSun.getBoundingClientRect();
            const footerRect = mainFooter.getBoundingClientRect();
            if (sunRect.bottom > footerRect.top) {
                // Calculate fade-out
                const fadeDistance = 100; // Fade over 100px
                const overlap = sunRect.bottom - footerRect.top;
                const opacity = Math.max(0, 1 - (overlap / fadeDistance));
                theSun.style.opacity = opacity;
            }

        } else if (scrollY > sunEndScroll) {
            // Hide sun after journey is over
            theSun.style.opacity = 0;
        } else {
            // Hide sun before journey begins (at scrollY = 0)
            theSun.style.opacity = 0;
        }
    }

    // Initial call and event listener
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll); // Recalculate on resize
});
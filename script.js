document.addEventListener("DOMContentLoaded", function() {
    const header = document.querySelector(".minimal-header");
    const theSun = document.getElementById("the-sun");
    const contentAdapters = document.querySelectorAll(".content-adapt");
    const mainFooter = document.getElementById("main-footer");

    // Define the sun's journey parameters
    const SUN_START_SCROLL = 0; // When sun begins its journey (start of page)
    const SUN_END_SCROLL_FACTOR = 0.8; // Sun ends its journey at 80% of scrollable height
    const SUN_CENTER_Y_PERCENT = 40; // Sun's center Y position in vh (top of viewport)
    const SUN_SIZE_PX = parseInt(getComputedStyle(theSun).getPropertyValue('--sun-size')); // Get sun size from CSS variable

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

    const sunInitialColorRgb = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--sun-initial-color').trim());
    const sunFinalColorRgb = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--sun-final-color').trim());


    // --- Scroll event handler ---
    function handleScroll() {
        const scrollY = window.scrollY;
        const totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const sunEndScroll = totalScrollableHeight * SUN_END_SCROLL_FACTOR;

        // Header scroll effect
        if (scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // Sun movement logic
        if (scrollY >= SUN_START_SCROLL && scrollY <= sunEndScroll) {
            theSun.style.opacity = 1; // Make sun visible
            let scrollProgress = (scrollY - SUN_START_SCROLL) / (sunEndScroll - SUN_START_SCROLL);
            scrollProgress = Math.min(1, Math.max(0, scrollProgress)); // Clamp between 0 and 1

            // Calculate X position (East to West)
            const viewportWidth = window.innerWidth;
            const sunStartX = viewportWidth + SUN_SIZE_PX / 2; // Start off-screen right
            const sunEndX = -SUN_SIZE_PX / 2; // End off-screen left
            const sunX = sunStartX - (scrollProgress * (sunStartX - sunEndX));
            
            // Calculate Y position (subtle arc: start low-right, peak high-middle, end low-left)
            // This is a simplified quadratic arc for illustration
            const sunYOffsetFactor = Math.sin(scrollProgress * Math.PI); // Peaks in middle, 0 at start/end
            const sunY = (SUN_CENTER_Y_PERCENT * window.innerHeight / 100) - (sunYOffsetFactor * SUN_SIZE_PX * 0.8); // Adjust multiplier for arc height

            theSun.style.left = `${sunX}px`;
            theSun.style.top = `${sunY}px`;

            // Interpolate sun color
            const currentColor = interpolateColor(sunInitialColorRgb, sunFinalColorRgb, scrollProgress);
            theSun.style.background = `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 10%, ${currentColor} 40%, ${currentColor} 70%, rgba(255, 255, 255, 0) 100%)`;
            theSun.style.boxShadow = `0 0 40px 10px ${currentColor.replace('rgb', 'rgba').replace(')', ', 0.6)')}`;

            // Content adaptation logic
            const sunRect = theSun.getBoundingClientRect(); // Get sun's current position
            contentAdapters.forEach(section => {
                const sectionRect = section.getBoundingClientRect();

                // Only adapt if section is in viewport
                if (sectionRect.bottom > 0 && sectionRect.top < window.innerHeight) {
                    if (sunRect.right > sectionRect.left && sunRect.left < sectionRect.right) {
                        // Sun is horizontally overlapping the section
                        if (sunRect.x < window.innerWidth / 2) { // Sun is on the left half of viewport
                            section.classList.remove('sun-offset-right');
                            section.classList.add('sun-offset-left');
                        } else { // Sun is on the right half of viewport
                            section.classList.remove('sun-offset-left');
                            section.classList.add('sun-offset-right');
                        }
                    } else {
                        section.classList.remove('sun-offset-left', 'sun-offset-right');
                    }
                } else {
                    section.classList.remove('sun-offset-left', 'sun-offset-right');
                }
            });

            // Hide sun when it hits the footer
            const footerRect = mainFooter.getBoundingClientRect();
            if (sunRect.bottom > footerRect.top) {
                theSun.style.opacity = 0;
            }

        } else {
            // Hide sun if outside its scroll range
            theSun.style.opacity = 0;
            contentAdapters.forEach(section => {
                section.classList.remove('sun-offset-left', 'sun-offset-right');
            });
        }
    }

    // Initial call and event listener
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll); // Recalculate on resize

});
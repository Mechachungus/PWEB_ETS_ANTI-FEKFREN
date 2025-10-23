document.addEventListener("DOMContentLoaded", function() {
    const header = document.querySelector(".minimal-header");
    const theSun = document.getElementById("the-sun");
    
    // ✅ 1. SELECT NEW ELEMENTS
    const theMoon = document.getElementById("the-moon");
    const darkModeToggle = document.getElementById("dark-mode-toggle");

    // --- Define Journey Parameters ---
    const SUN_END_SCROLL_FACTOR = 0.9; 
    const SUN_START_X_VW = 80;
    const SUN_END_X_VW = -5;   
    const SUN_START_Y_VH = 80;
    const SUN_PEAK_Y_VH = 20;  

    // --- Color conversion helpers ---
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

    // --- Get ALL Colors (Light & Dark) ---
    const sunInitialColorRgb = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--sun-initial-color').trim());
    const sunFinalColorRgb = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--sun-final-color').trim());
    const bgInitialColorRgb = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--bg-initial-color').trim());
    const bgFinalColorRgb = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--bg-final-color').trim());
    
    // ✅ NEW: Dark mode colors
    const bgDarkInitialRgb = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--bg-dark-initial').trim());
    const bgDarkFinalRgb = hexToRgb(getComputedStyle(document.documentElement).getPropertyValue('--bg-dark-final').trim());

    
    // --- ✅ 2. DARK MODE TOGGLE LOGIC ---
    
    // Check localStorage for saved theme
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }

    // Toggle button click event
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        // Save the choice in localStorage
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
        
        // Re-run scroll logic to update colors instantly
        handleScroll(); 
    });


    // --- ✅ 3. UPDATED Main Scroll event handler ---
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

        // --- Orb Movement Logic ---
        let scrollProgress = scrollY / sunEndScroll;
        scrollProgress = Math.min(1, Math.max(0, scrollProgress)); 
        
        // Calculate X position
        const sunStartX = viewportWidth * (SUN_START_X_VW / 100);
        const sunEndX = viewportWidth * (SUN_END_X_VW / 100);
        const orbX = sunStartX - (scrollProgress * (sunStartX - sunEndX));
        
        // Calculate Y position (Parabolic Arc)
        const peakY = viewportHeight * (SUN_PEAK_Y_VH / 100);
        const startY = viewportHeight * (SUN_START_Y_VH / 100);
        const arcAmplitude = startY - peakY;
        const parabolicFactor = -4 * Math.pow(scrollProgress - 0.5, 2) + 1;
        const orbY = startY - (parabolicFactor * arcAmplitude);

        // --- Apply styles based on Light or Dark Mode ---
        
        if (document.body.classList.contains('dark-mode')) {
            // --- DARK MODE is ON ---
            
            // 1. Move the Moon
            theMoon.style.left = `${orbX}px`;
            theMoon.style.top = `${orbY}px`;
            
            // 2. Interpolate DARK background color
            const currentBgColor = interpolateColor(bgDarkInitialRgb, bgDarkFinalRgb, scrollProgress);
            document.body.style.backgroundColor = currentBgColor;
            
            // 3. Ensure sun is hidden (for instant toggle)
            theSun.style.opacity = 0;
            theMoon.style.opacity = 1;

        } else {
            // --- LIGHT MODE is ON ---
            
            // 1. Move the Sun
            theSun.style.left = `${orbX}px`;
            theSun.style.top = `${orbY}px`;
            
            // 2. Interpolate LIGHT background color
            const currentBgColor = interpolateColor(bgInitialColorRgb, bgFinalColorRgb, scrollProgress);
            document.body.style.backgroundColor = currentBgColor;
            
            // 3. Interpolate sun orb color
            const currentColor = interpolateColor(sunInitialColorRgb, sunFinalColorRgb, scrollProgress);
            const currentGlow = currentColor.replace('rgb', 'rgba').replace(')', ', 0.5)');
            theSun.style.background = `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 20%, ${currentColor} 50%, ${currentGlow} 80%, rgba(255, 204, 0, 0) 100%)`;
            theSun.style.boxShadow = `0 0 80px 30px ${currentColor}, 0 0 140px 60px ${currentGlow.replace('0.5', '0.4')}`;

            // 4. Ensure moon is hidden (for instant toggle)
            theSun.style.opacity = 1;
            theMoon.style.opacity = 0;
        }
    }

    // Initial call to set orb position at page load
    handleScroll();
    
    // Add event listeners
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    // --- ✅ 4. SIDE MENU TOGGLE LOGIC ---
    
    // Select the new menu elements
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const sideMenu = document.getElementById('side-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    // Function to open the menu
    function openMenu() {
        sideMenu.classList.add('open');
        menuOverlay.classList.add('open');
    }

    // Function to close the menu
    function closeMenu() {
        sideMenu.classList.remove('open');
        menuOverlay.classList.remove('open');
    }

    // Event Listeners
    menuToggle.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);
    menuOverlay.addEventListener('click', closeMenu);
});
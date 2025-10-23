document.addEventListener("DOMContentLoaded", function() {

    // --- Select Global Elements ---
    const header = document.querySelector(".minimal-header");
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const sideMenu = document.getElementById('side-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const profileIconLink = document.getElementById('profile-icon-link');
    const langToggleButton = document.getElementById('lang-toggle-btn');

    // --- Define Sun/Moon Journey Parameters ---
    const SUN_END_SCROLL_FACTOR = 0.9;
    const SUN_START_X_VW = 80;
    const SUN_END_X_VW = -5;
    const SUN_START_Y_VH = 80;
    const SUN_PEAK_Y_VH = 20;

    // --- Color Conversion Helpers ---
    function interpolateColor(color1, color2, factor) {
        const result = color1.slice();
        for (let i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - result[i]));
        }
        return `rgb(${result.join(',')})`;
    }
    function hexToRgb(hex) {
        if (!hex) return [0, 0, 0]; // Default to black if hex is invalid
        const bigint = parseInt(hex.slice(1), 16);
        return [ (bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255 ];
    }

    // --- Get CSS Color Variables ---
    let sunInitialColorRgb, sunFinalColorRgb, bgInitialColorRgb, bgFinalColorRgb, bgDarkInitialRgb, bgDarkFinalRgb;
    function getCssColors() {
        const styles = getComputedStyle(document.documentElement);
        sunInitialColorRgb = hexToRgb(styles.getPropertyValue('--sun-initial-color')?.trim());
        sunFinalColorRgb = hexToRgb(styles.getPropertyValue('--sun-final-color')?.trim());
        bgInitialColorRgb = hexToRgb(styles.getPropertyValue('--bg-initial-color')?.trim());
        bgFinalColorRgb = hexToRgb(styles.getPropertyValue('--bg-final-color')?.trim());
        bgDarkInitialRgb = hexToRgb(styles.getPropertyValue('--bg-dark-initial')?.trim());
        bgDarkFinalRgb = hexToRgb(styles.getPropertyValue('--bg-dark-final')?.trim());
    }
    getCssColors(); // Get colors initially

    // --- Dark Mode Logic ---
    function applyDarkModePreference() {
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
    applyDarkModePreference(); // Apply on initial load

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
            
            // Re-run scroll logic only if sun/moon exist
            if (document.getElementById('the-sun')) {
                handleScroll();
            }
        });
    }

    // --- Main Scroll Handler (Sun/Moon Animation) ---
    function handleScroll() {
        const theSun = document.getElementById("the-sun");
        const theMoon = document.getElementById("the-moon");
        const scrollY = window.scrollY;

        // Header scroll effect
        if (header) {
            if (scrollY > 10) {
                header.classList.add("scrolled");
            } else {
                header.classList.remove("scrolled");
            }
        }

        // Exit if sun/moon elements don't exist on this page
        if (!theSun || !theMoon) {
            return;
        }

        // Orb Movement Logic
        const totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
        const sunEndScroll = totalScrollableHeight * SUN_END_SCROLL_FACTOR;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let scrollProgress = scrollY / sunEndScroll;
        scrollProgress = Math.min(1, Math.max(0, scrollProgress));

        const sunStartX = viewportWidth * (SUN_START_X_VW / 100);
        const sunEndX = viewportWidth * (SUN_END_X_VW / 100);
        const orbX = sunStartX - (scrollProgress * (sunStartX - sunEndX));

        const peakY = viewportHeight * (SUN_PEAK_Y_VH / 100);
        const startY = viewportHeight * (SUN_START_Y_VH / 100);
        const arcAmplitude = startY - peakY;
        const parabolicFactor = -4 * Math.pow(scrollProgress - 0.5, 2) + 1;
        const orbY = startY - (parabolicFactor * arcAmplitude);

        // Apply styles based on Light or Dark Mode
        if (document.body.classList.contains('dark-mode')) {
            theMoon.style.left = `${orbX}px`;
            theMoon.style.top = `${orbY}px`;
            const currentBgColor = interpolateColor(bgDarkInitialRgb, bgDarkFinalRgb, scrollProgress);
            document.body.style.backgroundColor = currentBgColor;
            theSun.style.opacity = 0;
            theMoon.style.opacity = 1;
        } else {
            theSun.style.left = `${orbX}px`;
            theSun.style.top = `${orbY}px`;
            const currentBgColor = interpolateColor(bgInitialColorRgb, bgFinalColorRgb, scrollProgress);
            document.body.style.backgroundColor = currentBgColor;
            const currentColor = interpolateColor(sunInitialColorRgb, sunFinalColorRgb, scrollProgress);
            const currentGlow = currentColor.replace('rgb', 'rgba').replace(')', ', 0.5)');
            theSun.style.background = `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 20%, ${currentColor} 50%, ${currentGlow} 80%, rgba(255, 204, 0, 0) 100%)`;
            theSun.style.boxShadow = `0 0 80px 30px ${currentColor}, 0 0 140px 60px ${currentGlow.replace('0.5', '0.4')}`;
            theSun.style.opacity = 1;
            theMoon.style.opacity = 0;
        }
    }

    // --- Side Menu Toggle Logic ---
    function openMenu() {
        if (sideMenu) sideMenu.classList.add('open');
        if (menuOverlay) menuOverlay.classList.add('open');
    }
    function closeMenu() {
        if (sideMenu) sideMenu.classList.remove('open');
        if (menuOverlay) menuOverlay.classList.remove('open');
    }
    if (menuToggle) menuToggle.addEventListener('click', openMenu);
    if (menuClose) menuClose.addEventListener('click', closeMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);

    // --- Global Auth Check ---
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (profileIconLink) {
            if (isLoggedIn === 'true') {
                profileIconLink.href = 'profile.html';
                profileIconLink.setAttribute('aria-label', 'View Profile');
            } else {
                profileIconLink.href = 'login.html';
                profileIconLink.setAttribute('aria-label', 'Login or Register');
            }
        }
    }
    checkLoginStatus(); // Check on initial load

    // --- Translation Logic ---
    function setLanguage(lang) {
        if (!translations || !translations[lang]) {
            console.warn(`Translations not found for language: ${lang}`);
            return;
        }

        document.querySelectorAll('[data-key]').forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[lang][key] !== undefined) { // Check if key exists
                if (key.includes('placeholder_')) {
                    element.placeholder = translations[lang][key];
                } else {
                    element.textContent = translations[lang][key];
                }
            } else {
                console.warn(`Translation key not found: ${key} for language: ${lang}`);
            }
        });

        if (langToggleButton) langToggleButton.textContent = lang.toUpperCase();
        localStorage.setItem('language', lang);
        document.documentElement.lang = lang; // Update HTML lang attribute
    }

    if (langToggleButton) {
        langToggleButton.addEventListener('click', () => {
            const currentLang = localStorage.getItem('language') || 'en';
            const newLang = currentLang === 'en' ? 'id' : 'en';
            setLanguage(newLang);
        });
    }

    // --- Initial Setup Calls ---
    const savedLang = localStorage.getItem('language') || 'en';
    setLanguage(savedLang); // Apply saved or default language

    if (document.getElementById('the-sun')) {
        handleScroll(); // Initial position for sun/moon if they exist
    }

    // --- Global Event Listeners ---
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", () => {
        getCssColors(); // Re-fetch colors if needed on resize
        if (document.getElementById('the-sun')) {
            handleScroll(); // Recalculate positions on resize
        }
    });

});


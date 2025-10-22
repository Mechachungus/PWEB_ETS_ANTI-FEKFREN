// Wait for the document to be fully loaded
document.addEventListener("DOMContentLoaded", function() {

    // Select the header element
    const header = document.querySelector(".minimal-header");

    // Listen for the scroll event on the window
    window.addEventListener("scroll", function() {
        
        // Check if the user has scrolled down more than 50 pixels
        if (window.scrollY > 50) {
            // Add the 'scrolled' class to the header
            header.classList.add("scrolled");
        } else {
            // Remove the 'scrolled' class from the header
            header.classList.remove("scrolled");
        }
    });

});
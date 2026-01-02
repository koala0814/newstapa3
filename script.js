// === GOOGLE TRANSLATE INTEGRATION ===
let isTranslated = false;
let translateApiReady = false;

// The official Google callback function - MUST have global scope
function googleTranslateElementInit() {
    console.log("Google Translate API initialized.");
    translateApiReady = true;
    
    // Initialize the widget but hide it
    new google.translate.TranslateElement({
        pageLanguage: 'mn',
        includedLanguages: 'en,mn',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false // Prevents the default dropdown from showing
    }, 'google_translate_element');
    
    // Update button state based on current language
    updateTranslateButtons();
    
    // Add mobile translate button to burger menu
    addMobileTranslateButton();
}

// Function to manually trigger translation
function triggerTranslation(targetLang) {
    if (!translateApiReady || typeof google === 'undefined') {
        console.error("Google Translate API not loaded yet.");
        showTranslationError("The translation service is still loading. Please wait a moment and try again.");
        return false;
    }

    try {
        // Access the select dropdown created by Google
        const selectField = document.querySelector('.goog-te-combo');
        if (selectField) {
            selectField.value = targetLang;
            // This event triggers the actual page translation
            selectField.dispatchEvent(new Event('change'));
            
            // Update our interface state
            isTranslated = (targetLang === 'en');
            updateTranslateButtons();
            return true;
        } else {
            console.error("Google Translate dropdown not found in page.");
            // Try to force a re-initialization
            setTimeout(() => {
                if (document.getElementById('google_translate_element').innerHTML === '') {
                    console.log("Attempting to reload page for translation...");
                    location.reload(); // Last resort reload
                }
            }, 500);
            return false;
        }
    } catch (error) {
        console.error("Error during translation:", error);
        showTranslationError("A translation error occurred. Please refresh the page.");
        return false;
    }
}

// Update all translate buttons
function updateTranslateButtons() {
    const translateBtns = document.querySelectorAll('.translate-btn');
    const mobileTranslateBtn = document.getElementById('mobileTranslateBtn');
    
    translateBtns.forEach(btn => {
        if (isTranslated) {
            btn.innerHTML = '<i class="fas fa-language"></i><span>Монгол</span>';
            btn.title = "Click to switch back to Mongolian";
        } else {
            btn.innerHTML = '<i class="fas fa-language"></i><span>English</span>';
            btn.title = "Click to translate to English";
        }
    });
    
    // Also update mobile-specific button if it exists
    if (mobileTranslateBtn) {
        if (isTranslated) {
            mobileTranslateBtn.innerHTML = '<i class="fas fa-language"></i><span>Монгол хэл рүү буцах</span>';
        } else {
            mobileTranslateBtn.innerHTML = '<i class="fas fa-language"></i><span>Англи хэл рүү орчуулах</span>';
        }
    }
}

// Add translate button to mobile menu
function addMobileTranslateButton() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;
    
    // Check if mobile translate button already exists
    if (document.getElementById('mobileTranslateBtn')) return;
    
    // Create mobile translate button
    const mobileTranslateLi = document.createElement('li');
    mobileTranslateLi.className = 'mobile-translate-btn';
    
    const mobileTranslateBtn = document.createElement('button');
    mobileTranslateBtn.id = 'mobileTranslateBtn';
    mobileTranslateBtn.className = 'translate-btn mobile-only';
    
    // Set initial text
    if (isTranslated) {
        mobileTranslateBtn.innerHTML = '<i class="fas fa-language"></i><span>Монгол хэл рүү буцах</span>';
    } else {
        mobileTranslateBtn.innerHTML = '<i class="fas fa-language"></i><span>Англи хэл рүү орчуулах</span>';
    }
    
    // Add click event
    mobileTranslateBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const targetLang = isTranslated ? 'mn' : 'en';
        triggerTranslation(targetLang);
        
        // Close mobile menu after clicking (optional)
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.getElementById('navMenu');
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    mobileTranslateLi.appendChild(mobileTranslateBtn);
    navMenu.appendChild(mobileTranslateLi);
}

// Show translation error
function showTranslationError(message) {
    // You can replace this with a nicer notification system
    alert(message);
}

// === WEBSITE FUNCTIONALITY ===
// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            mobileMenuBtn.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Section navigation
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get the target section id
            const targetSectionId = link.getAttribute('data-section');
            
            // Update active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
            
            // Hide all sections
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section
            const targetSection = document.getElementById(targetSectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (mobileMenuBtn) {
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
            
            // Scroll to top when switching sections
            window.scrollTo(0, 0);
        });
    });
    
    // Setup translate buttons
    const translateBtnDesktop = document.getElementById('translateBtnDesktop');
    const translateBtnMobile = document.getElementById('translateBtnMobile');
    
    if (translateBtnDesktop) {
        translateBtnDesktop.addEventListener('click', function(e) {
            e.preventDefault();
            const targetLang = isTranslated ? 'mn' : 'en';
            triggerTranslation(targetLang);
        });
    }
    
    if (translateBtnMobile) {
        translateBtnMobile.addEventListener('click', function(e) {
            e.preventDefault();
            const targetLang = isTranslated ? 'mn' : 'en';
            triggerTranslation(targetLang);
        });
    }
    
    // YouTube video placeholder click
    document.querySelectorAll('.video-placeholder').forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            const videoTitle = this.closest('.article-video').querySelector('.video-title').textContent;
            alert(`Та "${videoTitle}" видеог YouTube суваг дээрээс үзэх болномжтой. \n\nХолбоос: https://youtube.com/@budragchaaser`);
        });
    });
    
    // Periodically check if Google Translate loaded
    let loadAttempts = 0;
    const checkTranslateLoaded = setInterval(() => {
        if (typeof google !== 'undefined' && google.translate && translateApiReady) {
            console.log("Google Translate confirmed loaded.");
            clearInterval(checkTranslateLoaded);
            
            // Update buttons once loaded
            updateTranslateButtons();
        } else if (loadAttempts > 30) { // 15 second timeout (30 * 500ms)
            console.warn("Google Translate failed to load.");
            clearInterval(checkTranslateLoaded);
            
            // Disable translate buttons
            const translateBtns = document.querySelectorAll('.translate-btn');
            translateBtns.forEach(btn => {
                btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>Service Offline</span>';
                btn.style.backgroundColor = '#999';
                btn.disabled = true;
                btn.title = "Translation service unavailable";
            });
        }
        loadAttempts++;
    }, 500);
});
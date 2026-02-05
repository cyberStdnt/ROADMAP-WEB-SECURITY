// ========================================
// NAVIGATION
// ========================================
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    navLinks.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', function(e) {
    const nav = document.querySelector('.nav');
    const navLinks = document.getElementById('navLinks');
    const toggle = document.querySelector('.nav-toggle');
    
    if (navLinks && !nav.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// ========================================
// PROGRESS TRACKING
// ========================================
function updateProgress() {
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
    
    if (allCheckboxes.length === 0) return;
    
    const percent = Math.round((checkedBoxes.length / allCheckboxes.length) * 100);
    
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    
    if (progressBar) {
        progressBar.style.width = percent + '%';
    }
    
    if (progressPercent) {
        progressPercent.textContent = percent + '%';
    }
    
    // Save progress
    saveProgress();
}

function saveProgress() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const state = {};
    
    checkboxes.forEach((cb, index) => {
        const id = cb.id || cb.dataset.id || `checkbox-${index}`;
        state[id] = cb.checked;
    });
    
    const pageKey = window.location.pathname.split('/').pop() || 'index';
    localStorage.setItem(`websec-progress-${pageKey}`, JSON.stringify(state));
}

function loadProgress() {
    const pageKey = window.location.pathname.split('/').pop() || 'index';
    const saved = localStorage.getItem(`websec-progress-${pageKey}`);
    
    if (saved) {
        const state = JSON.parse(saved);
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        
        checkboxes.forEach((cb, index) => {
            const id = cb.id || cb.dataset.id || `checkbox-${index}`;
            if (state[id]) {
                cb.checked = true;
            }
        });
        
        updateProgress();
    }
}

// ========================================
// WEEK COMPLETION TOGGLE
// ========================================
function toggleWeek(checkbox) {
    const weekCard = checkbox.closest('.week-card');
    if (weekCard) {
        if (checkbox.checked) {
            weekCard.classList.add('completed');
        } else {
            weekCard.classList.remove('completed');
        }
    }
    updateProgress();
}

// ========================================
// COPY TO CLIPBOARD
// ========================================
function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        button.textContent = '✓ Copié!';
        button.style.background = 'var(--success)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    });
}

// ========================================
// SMOOTH SCROLL FOR ANCHORS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// INITIALIZE
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    
    // Add change listeners to all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.addEventListener('change', updateProgress);
    });
});

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .week-card, .timeline-item').forEach(el => {
    observer.observe(el);
});
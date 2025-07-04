// Main JavaScript for OWASP Top 10 Learning Platform

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    // Add fade-in animation to cards
    animateCards();
    
    // Initialize difficulty filter
    initializeDifficultyFilter();
    
    // Add hover effects and interactions
    addCardInteractions();
}

function animateCards() {
    const cards = document.querySelectorAll('.vulnerability-card');
    
    // Add fade-in animation with staggered delay
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function initializeDifficultyFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.vulnerability-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter cards
            filterCards(filter, cards);
        });
    });
}

function filterCards(filter, cards) {
    cards.forEach(card => {
        const difficulty = card.getAttribute('data-difficulty');
        
        if (filter === 'all' || difficulty === filter) {
            card.classList.remove('hidden');
            card.style.display = 'block';
        } else {
            card.classList.add('hidden');
            card.style.display = 'none';
        }
    });
    
    // Re-animate visible cards
    setTimeout(() => {
        const visibleCards = document.querySelectorAll('.vulnerability-card:not(.hidden)');
        visibleCards.forEach((card, index) => {
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = `fadeIn 0.5s ease ${index * 0.1}s`;
            }, 10);
        });
    }, 300);
}

function addCardInteractions() {
    const cards = document.querySelectorAll('.vulnerability-card');
    
    cards.forEach(card => {
        // Add click tracking for analytics (educational purposes)
        card.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                const vulnerability = this.querySelector('h3').textContent;
                console.log(`User clicked on: ${vulnerability}`);
                
                // You could add analytics tracking here
                trackVulnerabilityClick(vulnerability);
            }
        });
        
        // Add keyboard navigation support
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = this.querySelector('a');
                if (link) {
                    link.click();
                }
            }
        });
        
        // Make cards focusable for accessibility
        card.setAttribute('tabindex', '0');
    });
}

function trackVulnerabilityClick(vulnerability) {
    // This function could be used to track which vulnerabilities users are most interested in
    // For now, we'll just log to console
    console.log(`Analytics: User accessed ${vulnerability} at ${new Date().toISOString()}`);
    
    // You could implement actual analytics here:
    // - Google Analytics
    // - Custom tracking
    // - Learning progress tracking
}

// Utility function to show loading states
function showLoading(element) {
    if (element) {
        element.innerHTML = '<div class="loading">Loading...</div>';
    }
}

// Utility function to show error states
function showError(element, message) {
    if (element) {
        element.innerHTML = `<div class="error">Error: ${message}</div>`;
    }
}

// Utility function to format difficulty levels
function getDifficultyColor(difficulty) {
    const colors = {
        'beginner': '#2ecc71',
        'intermediate': '#f39c12',
        'advanced': '#e74c3c'
    };
    return colors[difficulty] || '#95a5a6';
}

// Add smooth scrolling for better UX
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Add search functionality (could be expanded)
function initializeSearch() {
    const searchInput = document.querySelector('#search-vulnerabilities');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const cards = document.querySelectorAll('.vulnerability-card');
            
            cards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Add progress tracking (could be expanded)
function initializeProgressTracking() {
    // Check if user has visited any vulnerabilities before
    const visitedVulnerabilities = JSON.parse(localStorage.getItem('visitedVulnerabilities') || '[]');
    
    // Mark visited vulnerabilities with a visual indicator
    visitedVulnerabilities.forEach(vuln => {
        const card = document.querySelector(`[href*="${vuln}"]`).closest('.vulnerability-card');
        if (card) {
            card.classList.add('visited');
            card.querySelector('.btn').innerHTML = '<i class="fas fa-check"></i> Continue Learning';
        }
    });
}

// Add keyboard shortcuts
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('#search-vulnerabilities');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape to clear filters
        if (e.key === 'Escape') {
            const filterButtons = document.querySelectorAll('.filter-btn');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelector('[data-filter="all"]').classList.add('active');
            filterCards('all', document.querySelectorAll('.vulnerability-card'));
        }
    });
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeProgressTracking();
    initializeKeyboardShortcuts();
});

// Export functions for use in other modules
window.OWASPApp = {
    trackVulnerabilityClick,
    showLoading,
    showError,
    getDifficultyColor,
    smoothScrollTo
}; 
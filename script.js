// Vibe Computing Landing Page Scripts

// Beta launch date - 7 days from now
const BETA_LAUNCH_DATE = new Date();
BETA_LAUNCH_DATE.setDate(BETA_LAUNCH_DATE.getDate() + 7);
BETA_LAUNCH_DATE.setHours(9, 0, 0, 0); // 9 AM launch

// DOM Elements
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const countdownMiniEl = document.getElementById('countdown-mini');
const betaForm = document.getElementById('beta-form');
const successMessage = document.getElementById('success-message');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const demoOutput = document.getElementById('demo-output');

// Countdown Timer
function updateCountdown() {
    const now = new Date().getTime();
    const distance = BETA_LAUNCH_DATE.getTime() - now;

    if (distance < 0) {
        // Launch has happened
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        countdownMiniEl.textContent = 'Now Live!';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');

    // Update mini countdown
    if (days > 0) {
        countdownMiniEl.textContent = `${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
        countdownMiniEl.textContent = `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
        countdownMiniEl.textContent = `${minutes} min`;
    }
}

// Initialize countdown
updateCountdown();
setInterval(updateCountdown, 1000);

// Beta Form Submission
if (betaForm) {
    betaForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = betaForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        const submitBtn = betaForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        // Add loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Joining...
        `;

        try {
            // Submit to backend API
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Show success message
                betaForm.classList.add('hidden');
                successMessage.classList.remove('hidden');
                console.log('Beta signup successful:', email);
            } else {
                throw new Error(data.error || 'Signup failed');
            }
        } catch (error) {
            console.error('Signup error:', error);

            // Show error state
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;

            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm';
            errorDiv.textContent = error.message || 'Something went wrong. Please try again.';

            // Remove existing error if any
            const existingError = betaForm.querySelector('.bg-red-500\\/10');
            if (existingError) existingError.remove();

            betaForm.appendChild(errorDiv);

            // Remove error after 5 seconds
            setTimeout(() => errorDiv.remove(), 5000);
        }
    });
}

// Mobile Menu Toggle
if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        document.body.classList.toggle('overflow-hidden');
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        });
    });
}

// Demo Terminal Animation
function animateDemo() {
    if (demoOutput) {
        setTimeout(() => {
            demoOutput.classList.remove('opacity-0');
            demoOutput.style.animation = 'fade-in-up 0.5s ease-out forwards';
        }, 2500);
    }
}

// Run demo animation after page load
window.addEventListener('load', () => {
    animateDemo();
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = 80; // Account for fixed nav
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations on scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all elements with fade-on-scroll class
document.querySelectorAll('.fade-on-scroll').forEach(el => {
    observer.observe(el);
});

// Add subtle parallax effect to hero
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const heroSection = document.querySelector('section');
            if (heroSection && scrolled < window.innerHeight) {
                heroSection.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
            ticking = false;
        });
        ticking = true;
    }
});

// Keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        }
        // Close enterprise modal
        if (enterpriseModal && !enterpriseModal.classList.contains('hidden')) {
            closeEnterpriseModal();
        }
    }
});

// Enterprise Modal
const enterpriseBtn = document.getElementById('enterprise-btn');
const enterpriseModal = document.getElementById('enterprise-modal');
const enterpriseModalClose = document.getElementById('enterprise-modal-close');
const enterpriseModalBackdrop = document.getElementById('enterprise-modal-backdrop');
const enterpriseForm = document.getElementById('enterprise-form');
const enterpriseSuccess = document.getElementById('enterprise-success');

function openEnterpriseModal() {
    if (enterpriseModal) {
        enterpriseModal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
    }
}

function closeEnterpriseModal() {
    if (enterpriseModal) {
        enterpriseModal.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
    }
}

if (enterpriseBtn) {
    enterpriseBtn.addEventListener('click', openEnterpriseModal);
}

if (enterpriseModalClose) {
    enterpriseModalClose.addEventListener('click', closeEnterpriseModal);
}

if (enterpriseModalBackdrop) {
    enterpriseModalBackdrop.addEventListener('click', closeEnterpriseModal);
}

// Enterprise Form Submission
if (enterpriseForm) {
    enterpriseForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(enterpriseForm);
        const data = {
            name: formData.get('name')?.trim(),
            email: formData.get('email')?.trim(),
            company: formData.get('company')?.trim(),
            servers: formData.get('servers')?.trim(),
            message: formData.get('message')?.trim(),
        };

        const submitBtn = enterpriseForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        // Add loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
        `;

        try {
            const response = await fetch('/api/enterprise', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Show success message
                enterpriseForm.classList.add('hidden');
                enterpriseSuccess.classList.remove('hidden');
                console.log('Enterprise request submitted:', data.email);
            } else {
                throw new Error(result.error || 'Submission failed');
            }
        } catch (error) {
            console.error('Enterprise form error:', error);

            // Reset button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;

            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm';
            errorDiv.textContent = error.message || 'Something went wrong. Please try again.';

            // Remove existing error if any
            const existingError = enterpriseForm.querySelector('.bg-red-500\\/10');
            if (existingError) existingError.remove();

            enterpriseForm.appendChild(errorDiv);

            // Remove error after 5 seconds
            setTimeout(() => errorDiv.remove(), 5000);
        }
    });
}

// Console Easter Egg
console.log(`
%c🚀 Vibe Computing %c
%cDescribe it. We build it. You run it.

Interested in joining our team? Email us at careers@techimbue.com
`,
'font-size: 24px; font-weight: bold; color: #0ea5e9;',
'',
'font-size: 14px; color: #9ca3af;'
);

// Feature: Add number ticker effect to countdown
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = String(value).padStart(2, '0');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Track page visibility for countdown accuracy
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        updateCountdown();
    }
});

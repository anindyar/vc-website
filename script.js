// Vibe Computing Landing Page Scripts

// Tagline Animation - "Infrastructure as Code" -> "Infrastructure as Thought"
const taglineText = document.getElementById('tagline-text');
const taglineCursor = document.getElementById('tagline-cursor');

async function animateTagline() {
    if (!taglineText) return;

    const typeSpeed = 100;
    const deleteSpeed = 80;
    const pauseDuration = 2000;

    async function typeWord(word) {
        for (let i = 0; i < word.length; i++) {
            taglineText.textContent += word[i];
            await new Promise(r => setTimeout(r, typeSpeed + Math.random() * 50));
        }
    }

    async function deleteWord(word) {
        for (let i = word.length; i > 0; i--) {
            taglineText.textContent = taglineText.textContent.slice(0, -1);
            await new Promise(r => setTimeout(r, deleteSpeed));
        }
    }

    // Initial delay
    await new Promise(r => setTimeout(r, 800));

    // Type "Code" in muted white (old way)
    taglineText.className = 'text-gray-400';
    await typeWord("Code");
    await new Promise(r => setTimeout(r, pauseDuration));

    // Delete "Code"
    await deleteWord("Code");
    await new Promise(r => setTimeout(r, 300));

    // Type "Thought" in brand color (new way)
    taglineText.className = 'text-brand-400';
    await typeWord("Thought");

    // Keep cursor blinking for a moment, then hide it
    await new Promise(r => setTimeout(r, 2000));
    if (taglineCursor) {
        taglineCursor.classList.add('opacity-0');
    }
}

// Start tagline animation on load
window.addEventListener('load', () => {
    animateTagline();
});

// Beta program end date - January 7th, 2026 at 11:59 PM
const BETA_LAUNCH_DATE = new Date('2026-01-07T23:59:59');

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
        countdownMiniEl.textContent = `${days} day${days > 1 ? 's' : ''} left`;
    } else if (hours > 0) {
        countdownMiniEl.textContent = `${hours} hour${hours > 1 ? 's' : ''} left`;
    } else {
        countdownMiniEl.textContent = `${minutes} min left`;
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

// Demo Console Animation
const demoScenarios = [
    {
        command: "check system load on my production servers",
        steps: [
            { name: "Connecting to prod-web-01", status: "complete" },
            { name: "Connecting to prod-web-02", status: "complete" },
            { name: "Connecting to prod-api-01", status: "complete" },
            { name: "Running uptime && free -h", status: "complete" }
        ],
        output: [
            "prod-web-01: load avg 0.05, mem 44% used",
            "prod-web-02: load avg 0.03, mem 38% used",
            "prod-api-01: load avg 0.12, mem 52% used"
        ],
        summary: "All 3 production servers are healthy. Load average is very low (0.03-0.12), memory usage under 55%. No action needed."
    },
    {
        command: "SSH into db-master and check replication status",
        steps: [
            { name: "Obfuscating sensitive data...", status: "complete" },
            { name: "192.168.1.50 → [HOST_1]", status: "complete" },
            { name: "db-master.internal → [HOST_2]", status: "complete" },
            { name: "Sending to LLM (data masked)", status: "complete" },
            { name: "Restoring real values in command", status: "complete" },
            { name: "Executing on db-master", status: "complete" }
        ],
        output: [
            "LLM sees: ssh [HOST_2] 'show replica status'",
            "Executed:  ssh db-master.internal '...'",
            "Replication lag: 0.3s | Status: OK"
        ],
        summary: "Your IPs and hostnames never left your network. LLM only saw anonymized placeholders. Replication is healthy with 0.3s lag."
    },
    {
        command: "show me all pods in the production namespace",
        steps: [
            { name: "Authenticating with cluster", status: "complete" },
            { name: "Fetching pods in production", status: "complete" },
            { name: "Analyzing pod health", status: "complete" }
        ],
        output: [
            "api-server-7d9f8b6c4-x2k9m   Running   2d",
            "api-server-7d9f8b6c4-p8n3q   Running   2d",
            "redis-master-0               Running   5d",
            "worker-5f7b8d9c6-j4h2k       Running   1d"
        ],
        summary: "All 4 pods in production namespace are running healthy. API server has 2 replicas, Redis master up for 5 days. No restarts detected."
    },
    {
        command: "scale the api deployment to 5 replicas",
        steps: [
            { name: "Validating deployment exists", status: "complete" },
            { name: "Scaling api-server to 5 replicas", status: "complete" },
            { name: "Waiting for pods to be ready", status: "complete" },
            { name: "Updating load balancer", status: "complete" }
        ],
        output: [
            "deployment.apps/api-server scaled",
            "5/5 replicas now available"
        ],
        summary: "API server scaled from 2 to 5 replicas successfully. All new pods are running and receiving traffic."
    },
    {
        command: "spin up a new t3.medium instance on AWS",
        steps: [
            { name: "Creating EC2 instance", status: "complete" },
            { name: "Waiting for instance to start", status: "complete" },
            { name: "Installing VC agent", status: "complete" },
            { name: "Connecting to dashboard", status: "complete" }
        ],
        output: [
            "Instance ID: i-0a1b2c3d4e5f67890",
            "Private IP: 10.0.1.45",
            "Status: running"
        ],
        summary: "New t3.medium instance launched in us-east-1. VC agent installed. Server 'aws-prod-04' is now available in your dashboard."
    },
    {
        command: "show me AWS costs for this month",
        steps: [
            { name: "Fetching AWS Cost Explorer data", status: "complete" },
            { name: "Aggregating by service", status: "complete" },
            { name: "Comparing with last month", status: "complete" }
        ],
        output: [
            "EC2-Instances        $234.56",
            "RDS                   $89.12",
            "S3                    $12.34",
            "Data Transfer         $45.67",
            "Total MTD:           $381.69"
        ],
        summary: "Your AWS spend this month is $381.69. EC2 is the biggest cost driver at $234. You're tracking 15% under last month's pace."
    },
    {
        command: "restart all pods that are in CrashLoopBackOff",
        steps: [
            { name: "Scanning all namespaces", status: "complete" },
            { name: "Found 2 failing pods", status: "complete" },
            { name: "Deleting worker-5f7b8d9c6-err01", status: "complete" },
            { name: "Deleting cron-job-failed-x9z", status: "complete" },
            { name: "Waiting for replacements", status: "complete" }
        ],
        output: [
            "2 pods deleted and replaced",
            "New pods initializing normally"
        ],
        summary: "Found and restarted 2 failing pods. New pods are running. Root cause appears to be OOM - consider increasing memory limits."
    }
];

let currentScenarioIndex = 0;
let isAnimating = false;

const typedCommand = document.getElementById('typed-command');
const userMessage = document.getElementById('user-message');
const inputTyping = document.getElementById('input-typing');
const inputPlaceholder = document.getElementById('input-placeholder');
const inputCursor = document.getElementById('input-cursor');
const sendBtn = document.getElementById('send-btn');
const aiResponse = document.getElementById('ai-response');
const aiThinking = document.getElementById('ai-thinking');
const aiTimeline = document.getElementById('ai-timeline');
const timelineSteps = document.getElementById('timeline-steps');
const aiOutput = document.getElementById('ai-output');
const outputText = document.getElementById('output-text');
const aiSummary = document.getElementById('ai-summary');
const summaryText = document.getElementById('summary-text');
const demoDots = document.querySelectorAll('.demo-dot');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeText(element, text, speed = 50) {
    element.textContent = '';
    for (let i = 0; i < text.length; i++) {
        element.textContent += text[i];
        await sleep(speed + Math.random() * 30);
    }
}

function resetDemo() {
    // Reset user message
    if (typedCommand) typedCommand.textContent = '';
    if (userMessage) userMessage.classList.add('hidden');

    // Reset input field
    if (inputTyping) inputTyping.textContent = '';
    if (inputPlaceholder) inputPlaceholder.classList.remove('hidden');
    if (inputCursor) inputCursor.classList.add('hidden');

    // Reset AI response
    if (aiResponse) aiResponse.classList.add('hidden');
    if (aiThinking) aiThinking.classList.remove('hidden');
    if (aiTimeline) aiTimeline.classList.add('hidden');
    if (timelineSteps) timelineSteps.innerHTML = '';
    if (aiOutput) aiOutput.classList.add('hidden');
    if (aiSummary) aiSummary.classList.add('hidden');
}

function updateDots(index) {
    demoDots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.remove('bg-white/20');
            dot.classList.add('bg-white/50');
        } else {
            dot.classList.remove('bg-white/50');
            dot.classList.add('bg-white/20');
        }
    });
}

function createStepElement(step, isLast) {
    const stepDiv = document.createElement('div');
    stepDiv.className = 'flex items-start gap-3 relative';

    // Vertical connector line (except for last step)
    const connectorLine = !isLast ? `<div class="absolute left-[7px] top-5 w-px h-full bg-white/10"></div>` : '';

    stepDiv.innerHTML = `
        ${connectorLine}
        <div class="step-indicator w-4 h-4 rounded-full border-2 border-gray-700 bg-gray-900 flex items-center justify-center shrink-0 mt-0.5 relative z-10">
            <div class="step-dot w-1.5 h-1.5 rounded-full bg-gray-600"></div>
        </div>
        <span class="step-text text-gray-600 text-sm pb-3">${step.name}</span>
    `;

    return stepDiv;
}

async function animateStep(stepElement, status) {
    const indicator = stepElement.querySelector('.step-indicator');
    const dot = stepElement.querySelector('.step-dot');
    const text = stepElement.querySelector('.step-text');

    // Show as in-progress first
    indicator.classList.remove('border-gray-700');
    indicator.classList.add('border-yellow-500');
    dot.classList.remove('bg-gray-600');
    dot.classList.add('bg-yellow-500', 'animate-pulse');
    text.classList.remove('text-gray-600');
    text.classList.add('text-gray-400');

    await sleep(400 + Math.random() * 300);

    // Complete the step
    indicator.classList.remove('border-yellow-500');
    indicator.classList.add('border-emerald-500');
    dot.classList.remove('bg-yellow-500', 'animate-pulse');
    dot.classList.add('bg-emerald-500');
    text.classList.remove('text-gray-400');
    text.classList.add('text-gray-300');
}

async function runDemoScenario(index) {
    if (isAnimating) return;
    isAnimating = true;

    const scenario = demoScenarios[index];
    resetDemo();
    updateDots(index);

    // Show cursor and hide placeholder in input field
    if (inputPlaceholder) inputPlaceholder.classList.add('hidden');
    if (inputCursor) inputCursor.classList.remove('hidden');

    // Type in the input field
    await typeText(inputTyping, scenario.command, 35);

    await sleep(300);

    // "Send" the message - move to chat bubble instantly
    if (inputCursor) inputCursor.classList.add('hidden');
    if (typedCommand) typedCommand.textContent = scenario.command;
    if (userMessage) userMessage.classList.remove('hidden');
    if (inputTyping) inputTyping.textContent = '';
    if (inputPlaceholder) inputPlaceholder.classList.remove('hidden');

    await sleep(400);

    // Show AI response with thinking
    if (aiResponse) aiResponse.classList.remove('hidden');
    await sleep(1000);

    // Hide thinking, show timeline
    if (aiThinking) aiThinking.classList.add('hidden');
    if (aiTimeline) aiTimeline.classList.remove('hidden');

    // Create and animate steps
    if (timelineSteps && scenario.steps) {
        // First, add all steps as pending
        scenario.steps.forEach((step, i) => {
            const stepEl = createStepElement(step, i === scenario.steps.length - 1);
            timelineSteps.appendChild(stepEl);
        });

        // Then animate each step sequentially
        const stepElements = timelineSteps.querySelectorAll('.flex.items-start');
        for (const stepEl of stepElements) {
            await animateStep(stepEl, 'complete');
        }
    }

    await sleep(400);

    // Show output
    if (aiOutput && scenario.output) {
        aiOutput.classList.remove('hidden');
        if (outputText) {
            outputText.innerHTML = '';
            for (const line of scenario.output) {
                const p = document.createElement('p');
                outputText.appendChild(p);
                await typeText(p, line, 12);
            }
        }
    }

    await sleep(400);

    // Show summary
    if (aiSummary) aiSummary.classList.remove('hidden');
    if (summaryText) summaryText.textContent = scenario.summary;

    isAnimating = false;
}

async function startDemoLoop() {
    if (!typedCommand) return;

    while (true) {
        await runDemoScenario(currentScenarioIndex);
        await sleep(5000); // Wait before next scenario
        currentScenarioIndex = (currentScenarioIndex + 1) % demoScenarios.length;
    }
}

// Handle dot clicks
demoDots.forEach(dot => {
    dot.addEventListener('click', () => {
        const index = parseInt(dot.dataset.index);
        if (!isAnimating && index !== currentScenarioIndex) {
            currentScenarioIndex = index;
            runDemoScenario(index);
        }
    });
});

// Run demo animation after page load
window.addEventListener('load', () => {
    // Start demo when terminal is in view
    const terminalSection = document.querySelector('#terminal-content');
    if (terminalSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startDemoLoop();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });
        observer.observe(terminalSection);
    }
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

// Parallax fade effect for hero section (fade out as you scroll)
let ticking = false;
const heroContent = document.querySelector('.relative.z-10.max-w-7xl');
const heroBlobs = document.querySelectorAll('.animate-pulse-slow');

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const heroHeight = window.innerHeight;

            if (scrolled < heroHeight) {
                const progress = scrolled / heroHeight;
                const opacity = 1 - (progress * 1.2);
                const scale = 1 - (progress * 0.1);

                if (heroContent) {
                    heroContent.style.opacity = Math.max(0, opacity);
                    heroContent.style.transform = `scale(${Math.max(0.9, scale)})`;
                }

                // Move blobs slightly for depth
                heroBlobs.forEach((blob, i) => {
                    const direction = i % 2 === 0 ? 1 : -1;
                    blob.style.transform = `translateY(${scrolled * 0.2 * direction}px)`;
                });
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

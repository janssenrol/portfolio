// Initialize AOS Animation
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Initialize when page loads
window.addEventListener("load", () => {
    initializePortfolio();
});
 initializeTypewriter();

function initializePortfolio() {
    // 1. DARK/LIGHT MODE - PROPER WORKING
    initializeThemeToggle();

    // 2. SKILL BARS ANIMATION
    initializeSkillBars();

    // 3. MOBILE MENU
    initializeMobileMenu();

    // 4. CONTACT FORM
    initializeContactForm();

    // 5. DOWNLOAD CV
    // initializeDownloadCV();

    // 6. SMOOTH SCROLL & ACTIVE NAV
    initializeSmoothScroll();

    // 7. BACK TO TOP
    initializeBackToTop();

    // 8. TYPEWRITER EFFECT
   
}

// 1. DARK/LIGHT MODE FUNCTION
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    const body = document.body;

    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        enableLightMode();
    } else {
        enableDarkMode();
    }

    // Desktop toggle
    themeToggle?.addEventListener('click', toggleTheme);

    // Mobile toggle
    mobileThemeToggle?.addEventListener('click', toggleTheme);

    function toggleTheme() {
        if (body.classList.contains('dark')) {
            enableLightMode();
        } else {
            enableDarkMode();
        }
    }

    function enableLightMode() {
        body.classList.remove('dark');
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');

        // Update toggle buttons
        document.querySelectorAll('.theme-toggle div').forEach(div => {
            div.style.transform = 'translateX(28px)';
        });
    }

    function enableDarkMode() {
        body.classList.remove('light-mode');
        body.classList.add('dark');
        localStorage.setItem('theme', 'dark');

        // Update toggle buttons
        document.querySelectorAll('.theme-toggle div').forEach(div => {
            div.style.transform = 'translateX(2px)';
        });
    }
}

// 2. SKILL BARS
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-level');

    // Intersection Observer for animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
}

// 3. MOBILE MENU
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    mobileMenuBtn?.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        mobileMenu.style.maxHeight = mobileMenu.classList.contains('active') ? '400px' : '0';
    });

    // Close menu when clicking links
    document.querySelectorAll('#mobileMenu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            mobileMenu.style.maxHeight = '0';
        });
    });
}

// 4. CONTACT FORM
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitLoader = document.getElementById('submitLoader');

    contactForm?.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };

        // Show loading
        submitBtn.disabled = true;
        submitText.textContent = 'Sending...';
        if (submitLoader) submitLoader.classList.remove('hidden');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Log to console (in real project, send to backend)
            console.log('Form submitted:', formData);

            // Show success
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');

            // Reset form
            contactForm.reset();

        } catch (error) {
            showNotification('Something went wrong. Please try again.', 'error');
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitText.textContent = 'Send Message';
            if (submitLoader) submitLoader.classList.add('hidden');
        }
    });
}

// 6. SMOOTH SCROLL & ACTIVE NAV
function initializeSmoothScroll() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active nav link on scroll
    window.addEventListener('scroll', updateActiveNav);

    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Initial call
    updateActiveNav();
}

// 7. BACK TO TOP
// 4. CONTACT FORM - WITH FORMSPREE
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitLoader = document.getElementById('submitLoader');
    const formMessage = document.getElementById('formMessage');

    if (!contactForm) return;

    // Form submission handler
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Show loading state
        submitBtn.disabled = true;
        submitText.textContent = 'Sending...';
        if (submitLoader) submitLoader.classList.remove('hidden');

        // Hide previous messages
        formMessage.classList.add('hidden');

        try {
            // Get form data
            const formData = new FormData(this);

            // Send to Formspree
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success
                formMessage.textContent = '✅ Message sent successfully! I\'ll get back to you soon.';
                formMessage.className = 'mt-4 p-3 rounded-lg bg-green-500/20 text-green-300 border border-green-500/30';
                formMessage.classList.remove('hidden');

                // Reset form
                contactForm.reset();

                // Optional: Redirect to thank you page or show modal
                // window.location.href = '/thank-you.html';

            } else {
                // Error from Formspree
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to send message');
            }

        } catch (error) {
            // Show error message
            formMessage.textContent = `❌ ${error.message || 'Something went wrong. Please try again.'}`;
            formMessage.className = 'mt-4 p-3 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30';
            formMessage.classList.remove('hidden');

            console.error('Form submission error:', error);

        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitText.textContent = 'Send Message';
            if (submitLoader) submitLoader.classList.add('hidden');

            // Auto-hide message after 5 seconds
            setTimeout(() => {
                formMessage.classList.add('hidden');
            }, 5000);
        }
    });
}
// 8. TYPEWRITER EFFECT
function initializeTypewriter() {
    const typewriter = document.querySelector('.typewriter');
    if (!typewriter) return;

    const texts = [
        "Full Stack Developer & Problem Solver",
        "Building Scalable Web Applications",
        "React & Node.js Specialist",
        "Creating Digital Solutions"
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let started = false;

    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            typewriter.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriter.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(type, 2000);
            return;
        }

        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(type, 500);
            return;
        }

        setTimeout(type, isDeleting ? 50 : 100);
    }

    // 🔥 Start ONLY when visible (AOS safe)
    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !started) {
            started = true;
            type();
            observer.disconnect();
        }
    }, { threshold: 0.6 });

    observer.observe(typewriter);
}


// NOTIFICATION FUNCTION
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-6 py-4 rounded-lg z-50 shadow-lg transform translate-x-full transition-transform duration-300 ${type === 'success'
            ? 'bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 text-green-300'
            : 'bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 text-red-300'
        }`;

    notification.innerHTML = `
                <div class="flex items-center">
                    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-3 text-lg"></i>
                    <div>
                        <div class="font-medium">${type === 'success' ? 'Success!' : 'Error!'}</div>
                        <div class="text-sm opacity-90">${message}</div>
                    </div>
                </div>
            `;

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);

    // Close on click
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

// Add CSS for small loader
const style = document.createElement('style');
style.textContent = `
            .loader-small {
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 2px solid rgba(100, 116, 139, 0.2);
                border-top: 2px solid #3b82f6;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
        `;
document.head.appendChild(style);
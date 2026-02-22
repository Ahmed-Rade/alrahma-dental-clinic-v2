// ===== PAGE LOADER =====
window.addEventListener('load', function () {
    const loader = document.getElementById('pageLoader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1800);
    }
});

document.addEventListener('DOMContentLoaded', function () {

    // ===== PARTICLE CANVAS =====
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = [];
        const PARTICLE_COUNT = 35;
        const DENTAL_SYMBOLS = ['🦷', '✨', '💎', '⭐', '🌟'];

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.4 + 0.05;
                this.color = `rgba(14, 165, 233, ${this.opacity})`;
                this.type = Math.random() < 0.3 ? 'tooth' : 'dot';
                this.symbol = DENTAL_SYMBOLS[Math.floor(Math.random() * DENTAL_SYMBOLS.length)];
                this.rotation = Math.random() * 360;
                this.rotSpeed = (Math.random() - 0.5) * 0.5;
                this.life = Math.random() * 200 + 100;
                this.maxLife = this.life;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.rotation += this.rotSpeed;
                this.life--;
                if (this.life <= 0 || this.x < -50 || this.x > canvas.width + 50 || this.y < -50 || this.y > canvas.height + 50) {
                    this.reset();
                }
            }
            draw() {
                const fadeRatio = Math.min(this.life / 30, (this.maxLife - this.life) / 30, 1);
                ctx.save();
                ctx.globalAlpha = this.opacity * fadeRatio;
                if (this.type === 'dot') {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
                    ctx.fill();
                    // glow
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                    const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
                    grd.addColorStop(0, `rgba(14, 165, 233, 0.1)`);
                    grd.addColorStop(1, `rgba(14, 165, 233, 0)`);
                    ctx.fillStyle = grd;
                    ctx.fill();
                }
                ctx.restore();
            }
        }

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }

        // Draw connecting lines
        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.save();
                        ctx.globalAlpha = (1 - dist / 120) * 0.08;
                        ctx.strokeStyle = '#0EA5E9';
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                        ctx.restore();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawLines();
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // ===== Smooth Scroll & Navigation =====
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                window.scrollTo({ top: targetSection.offsetTop - navHeight, behavior: 'smooth' });
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                // Close mobile menu
                document.querySelector('.nav-links').classList.remove('show');
                document.querySelector('.mobile-menu-toggle').classList.remove('active');
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });

    // Update active nav on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', function () {
        const scrollPosition = window.pageYOffset + 120;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) link.classList.add('active');
                });
            }
        });
    });

    // ===== Mobile Menu =====
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function () {
            this.classList.toggle('active');
            navLinksContainer.classList.toggle('show');
        });
    }

    // ===== Scroll Animations =====
    const animatedElements = document.querySelectorAll('[data-animation]');
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 80);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    animatedElements.forEach(el => observer.observe(el));

    // ===== CTA Button Handlers =====
    const ctaButtons = document.querySelectorAll('.cta-button, .nav-cta, .primary-button, .cta-primary-button');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            // Ripple
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            setTimeout(() => ripple.remove(), 600);
            // Scroll to contact
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                window.scrollTo({ top: contactSection.offsetTop - navHeight, behavior: 'smooth' });
            }
        });
    });

    // ===== Secondary Button =====
    document.querySelectorAll('.secondary-button').forEach(button => {
        button.addEventListener('click', () => {
            const servicesSection = document.querySelector('#services');
            if (servicesSection) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                window.scrollTo({ top: servicesSection.offsetTop - navHeight, behavior: 'smooth' });
            }
        });
    });

    // ===== Floating Contact Bar =====
    document.querySelectorAll('.floating-contact-bar .contact-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.addEventListener('click', function () {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => this.style.transform = '', 150);
        });
    });

    // ===== Counter Animation =====
    const statNumbers = document.querySelectorAll('.stat-number');
    const animateCounter = (element) => {
        const target = element.textContent;
        const isPercentage = target.includes('%');
        const numericTarget = parseInt(target.replace(/[^0-9]/g, ''));
        let current = 0;
        const increment = numericTarget / 50;
        const updateCounter = () => {
            current += increment;
            if (current < numericTarget) {
                element.textContent = isPercentage ? Math.floor(current) + '%' : '+' + Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        updateCounter();
    };
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { animateCounter(entry.target); statsObserver.unobserve(entry.target); }
        });
    }, { threshold: 0.5 });
    statNumbers.forEach(stat => statsObserver.observe(stat));

    // ===== Doctor Cards Parallax =====
    document.querySelectorAll('.doctor-card').forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const percentX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            const percentY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
            this.style.transform = `perspective(1000px) rotateY(${percentX * 5}deg) rotateX(${-percentY * 5}deg) translateY(-10px)`;
        });
        card.addEventListener('mouseleave', function () { this.style.transform = ''; });
    });

    // ===== Gallery hover depth =====
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            document.querySelectorAll('.gallery-item').forEach(other => {
                if (other !== this) other.style.opacity = '0.7';
            });
        });
        item.addEventListener('mouseleave', function() {
            document.querySelectorAll('.gallery-item').forEach(other => other.style.opacity = '1');
        });
    });

    // ===== Service Cards =====
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function () {
            document.querySelectorAll('.service-card').forEach(other => {
                if (other !== this) other.style.opacity = '0.7';
            });
        });
        card.addEventListener('mouseleave', function () {
            document.querySelectorAll('.service-card').forEach(other => other.style.opacity = '1');
        });
    });

    // ===== Social Links =====
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', function () {
            this.style.transform = 'scale(0.9)';
            setTimeout(() => this.style.transform = '', 150);
        });
    });

    // ===== Scroll to Top =====
    const scrollToTopButton = document.createElement('button');
    scrollToTopButton.innerHTML = '↑';
    scrollToTopButton.style.cssText = `
        position: fixed; bottom: 30px; right: 30px;
        width: 50px; height: 50px;
        background: linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%);
        color: white; border: none; border-radius: 50%;
        font-size: 1.5rem; cursor: pointer;
        opacity: 0; transform: scale(0);
        transition: all 0.3s ease;
        box-shadow: 0 4px 16px rgba(14, 165, 233, 0.3);
        z-index: 998;
    `;
    document.body.appendChild(scrollToTopButton);
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 500) {
            scrollToTopButton.style.opacity = '1';
            scrollToTopButton.style.transform = 'scale(1)';
        } else {
            scrollToTopButton.style.opacity = '0';
            scrollToTopButton.style.transform = 'scale(0)';
        }
    });
    scrollToTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    scrollToTopButton.addEventListener('mouseenter', function () { this.style.transform = 'scale(1.1)'; });
    scrollToTopButton.addEventListener('mouseleave', function () { this.style.transform = 'scale(1)'; });

    // ===== Parallax on Hero Shapes =====
    const heroShapes = document.querySelectorAll('.hero-shape');
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        heroShapes.forEach((shape, index) => {
            shape.style.transform = `translateY(${scrolled * (index + 1) * 0.08}px)`;
        });
    });

    // ===== Add Ripple Style =====
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .ripple { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.5); transform: scale(0); animation: ripple-animation 0.6s ease-out; pointer-events: none; }
        @keyframes ripple-animation { to { transform: scale(4); opacity: 0; } }
        button { position: relative; overflow: hidden; }
    `;
    document.head.appendChild(rippleStyle);

    // ===== Cinematic entrance for hero =====
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(40px)';
        heroContent.style.transition = 'all 1s ease 0.5s';
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }

    // ===== Animated typing cursor =====
    const gradientText = document.querySelector('.typing-text');
    if (gradientText) {
        const original = gradientText.textContent;
        gradientText.textContent = '';
        let i = 0;
        const typeTimer = setInterval(() => {
            if (i < original.length) {
                gradientText.textContent += original[i++];
            } else {
                clearInterval(typeTimer);
            }
        }, 100);
    }

    console.log('%c🦷 عيادة الرحمة - التميز في الابتسامة', 'font-size: 20px; color: #0EA5E9; font-weight: bold;');
    console.log('%c✨ موقع احترافي مصمم بعناية فائقة', 'font-size: 14px; color: #06B6D4;');
});

// ===== Keyboard Accessibility =====
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const mobileMenu = document.querySelector('.nav-links.show');
        if (mobileMenu) {
            mobileMenu.classList.remove('show');
            document.querySelector('.mobile-menu-toggle').classList.remove('active');
        }
    }
});

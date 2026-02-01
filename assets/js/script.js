// Reveal Animations on Scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

function initAnimations() {
    document.querySelectorAll('.glass-card, .section-title, .timeline-item').forEach((el) => {
        el.style.opacity = '0'; // Initial state
        observer.observe(el);
    });
}

// Theme Toggle Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;
const icon = themeToggleBtn.querySelector('i');

// Check local storage
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    body.setAttribute('data-theme', currentTheme);
    updateIcon(currentTheme);
}

themeToggleBtn.addEventListener('click', () => {
    const isLight = body.getAttribute('data-theme') === 'light';
    const newTheme = isLight ? 'dark' : 'light';

    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcon(newTheme);
    updateNavbar(); // Force navbar update on theme switch
});

function updateIcon(theme) {
    if (theme === 'light') {
        icon.classList.remove('fa-moon', 'text-secondary');
        icon.classList.add('fa-sun', 'text-warning');
    } else {
        icon.classList.remove('fa-sun', 'text-warning');
        icon.classList.add('fa-moon', 'text-secondary');
    }
}

// Navbar background on scroll
// Navbar background on scroll and theme switch
function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    const isLight = document.body.getAttribute('data-theme') === 'light';
    const scrollBg = isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(10, 14, 23, 0.95)';
    const transparentBg = isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(10, 14, 23, 0.85)';

    if (window.scrollY > 50) {
        navbar.classList.add('shadow-lg');
        navbar.style.background = scrollBg;
    } else {
        navbar.classList.remove('shadow-lg');
        navbar.style.background = transparentBg;
    }
}

window.addEventListener('scroll', updateNavbar);

// Typing Effect
const roles = ["Technical Lead", "Full Stack Developer", "Azure Specialist", "Software Engineer"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typeSpeed = 100;
const deleteSpeed = 50;
const pauseSpeed = 2000;

const typeTextElement = document.querySelector('.typing-text');

function typeEffect() {
    if (!typeTextElement) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
        typeTextElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typeTextElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(typeEffect, pauseSpeed);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeEffect, 500);
    } else {
        setTimeout(typeEffect, isDeleting ? deleteSpeed : typeSpeed);
    }
}

// Data Rendering Functions
function renderPortfolio() {
    if (typeof portfolioData === 'undefined') {
        console.error('Portfolio data not found!');
        return;
    }

    renderSummary();
    renderExperience();
    renderSkills();
    renderProjects();
    renderAchievements();
    renderContact();

    // Refresh animations after dynamic content is added
    setTimeout(initAnimations, 100);
}

function renderSummary() {
    const container = document.getElementById('about-container');
    if (!container) return;

    let bulletsHtml = '<ul class="list-unstyled text-secondary lead mb-4">';
    portfolioData.summary.bullets.forEach(bullet => {
        bulletsHtml += `
            <li class="mb-3 d-flex">
                <i class="fas fa-check-circle text-primary mt-1 me-3"></i> 
                <span>${bullet}</span>
            </li>`;
    });
    bulletsHtml += '</ul>';

    const statsHtml = `
        <div class="row mt-4 g-4 justify-content-center text-center">
            <div class="col-6 col-md-3">
                <h3 class="fw-bold text-primary">11+</h3>
                <p class="text-secondary small">Years Experience</p>
            </div>
            <div class="col-6 col-md-3">
                <h3 class="fw-bold text-primary">Azure</h3>
                <p class="text-secondary small">Certified Associate</p>
            </div>
            <div class="col-6 col-md-3">
                <h3 class="fw-bold text-primary">Leader</h3>
                <p class="text-secondary small">Future Leaders Program</p>
            </div>
        </div>
    `;

    container.innerHTML = bulletsHtml + statsHtml;
}

function renderExperience() {
    const container = document.getElementById('experience-container');
    if (!container) return;

    let html = '<div class="timeline-line"></div>'; // Keep the line

    portfolioData.experience.forEach((job, index) => {
        const isLeft = index % 2 === 0;

        const contentHtml = `
            <div class="glass-card p-4 hover-lift">
                <h4 class="text-white">${job.title}</h4>
                <h6 class="text-primary">${job.org}</h6>
                <p class="text-secondary small mb-0">${job.period}</p>
                <p class="text-white small mb-0 opacity-75">${job.location}</p>
                <hr class="border-secondary opacity-25">
                <a href="${job.companyUrl}" target="_blank" class="text-primary small text-decoration-none">Visit Company <i class="fas fa-external-link-alt ms-1"></i></a>
            </div>
        `;

        html += `
            <div class="row timeline-item mb-5 align-items-center" style="animation-delay: ${index * 0.2}s">
                <div class="col-md-5 order-2 ${isLeft ? 'order-md-1 text-md-end' : 'order-md-1'}">
                    ${isLeft ? contentHtml : ''}
                </div>
                <div class="col-md-2 order-1 order-md-2 text-center position-relative">
                    <div class="timeline-dot"></div>
                </div>
                <div class="col-md-5 order-3 ${isLeft ? 'order-md-3' : 'order-md-3 text-start'}">
                    ${!isLeft ? contentHtml : ''}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function renderSkills() {
    const container = document.getElementById('skills-container');
    if (!container) return;

    let html = '';

    // Map icons to groups for better visuals (optional)
    const iconMap = {
        "Programming Languages": "fas fa-code",
        "Web Technologies": "fas fa-globe",
        "Cloud Technologies": "fas fa-cloud",
        "Scripting Languages": "fab fa-js",
        "Styling Languages": "fab fa-css3-alt",
        "Databases": "fas fa-database",
        "Framework Tools": "fas fa-layer-group",
        "Tools & Others": "fas fa-tools"
    };

    portfolioData.skills.forEach((skillGroup, index) => {
        const icon = iconMap[skillGroup.group] || "fas fa-tools";

        let tagsHtml = '';
        skillGroup.items.forEach(item => {
            tagsHtml += `<span class="skill-tag">${item}</span>`;
        });

        html += `
            <div class="col-md-6 col-lg-4">
                <div class="glass-card p-4 h-100 text-center" style="animation-delay: ${index * 0.1}s">
                    <div class="icon-box mb-3 mx-auto">
                        <i class="${icon} fa-2x text-primary"></i>
                    </div>
                    <h4 class="text-white mb-3 text-center">${skillGroup.group}</h4>
                    <div class="d-flex flex-wrap gap-2 justify-content-center">
                        ${tagsHtml}
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function renderProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    let html = '';
    portfolioData.projects.forEach((project, index) => {
        let stackHtml = '';
        project.stack.forEach(tech => {
            stackHtml += `<span class="badge bg-dark border border-secondary">${tech}</span>`;
        });

        let highlightsHtml = '';
        // Taking only first 2 highlights to keep card size consistent
        const previewHighlights = project.highlights.slice(0, 6);
        previewHighlights.forEach(hl => {
            highlightsHtml += `<li class="small text-secondary mb-1"><i class="fas fa-angle-right text-primary me-2"></i>${hl}</li>`;
        });

        html += `
             <div class="col-lg-6">
                <div class="project-card glass-card overflow-hidden h-100" style="animation-delay: ${index * 0.2}s">
                        <div class="p-4 d-flex flex-column h-100">
                        <div class="mb-3">
                            <h4 class="text-white mb-1">${project.name}</h4>
                            <small class="text-primary text-uppercase">Client: ${project.client} | Org: ${project.org}</small>
                        </div>
                        <p class="text-secondary mb-3">
                            ${project.description}
                        </p>
                        <ul class="list-unstyled mb-3 flex-grow-1">
                            ${highlightsHtml}
                        </ul>
                        <div class="d-flex flex-wrap gap-2 mt-auto">
                            ${stackHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function renderAchievements() {
    const container = document.getElementById('achievements-container');
    if (!container) return;

    let html = '';
    portfolioData.trainings.forEach((training, index) => {
        const certificateBtn = training.path
            ? `<a href="assets/data/${training.path}" target="_blank" class="btn btn-sm btn-outline-primary mt-3">View</a>`
            : '';

        html += `
            <div class="col-md-6 col-lg-4">
                <div class="glass-card p-4 text-center h-100 d-flex flex-column" style="animation-delay: ${index * 0.1}s">
                    <div class="icon-box-sm bg-primary rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style="width: 60px; height: 60px;">
                        <i class="fas fa-certificate text-white fa-lg"></i>
                    </div>
                    <h5 class="text-white">${training.title}</h5>
                    <p class="text-secondary small mb-3 flex-grow-1">${training.summary}</p>
                    <div class="mt-auto">
                        ${certificateBtn}
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function renderContact() {
    const contactContainer = document.getElementById('contact-details');
    const socialContainer = document.getElementById('social-links');

    if (contactContainer) {
        contactContainer.innerHTML = `
            <a href="mailto:${portfolioData.contact.email}" class="d-flex align-items-center gap-3 text-decoration-none highlight-hover">
                <div class="icon-box-sm bg-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                    <i class="fas fa-envelope text-white"></i>
                </div>
                <div class="text-start">
                    <h6 class="text-secondary mb-0">Email Me</h6>
                    <h5 class="text-white mb-0">${portfolioData.contact.email}</h5>
                </div>
            </a>
            <a href="tel:${portfolioData.contact.phone}" class="d-flex align-items-center gap-3 text-decoration-none highlight-hover">
                <div class="icon-box-sm bg-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 50px; height: 50px;">
                    <i class="fas fa-phone text-white"></i>
                </div>
                <div class="text-start">
                    <h6 class="text-secondary mb-0">Call Me</h6>
                    <h5 class="text-white mb-0">${portfolioData.contact.phone}</h5>
                </div>
            </a>
        `;
    }

    if (socialContainer) {
        socialContainer.innerHTML = `
            <a href="${portfolioData.social.linkedin}" target="_blank" class="btn btn-outline-light rounded-circle p-3 social-btn"><i class="fab fa-linkedin-in"></i></a>
            <a href="${portfolioData.social.github}" target="_blank" class="btn btn-outline-light rounded-circle p-3 social-btn"><i class="fab fa-github"></i></a>
        `;
    }
}

// Start everything when DOM is loaded
// Close navbar on click
function initNavbarAutoClose() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    const navLinks = document.querySelectorAll('.nav-link');

    // Close on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!navbarCollapse.contains(e.target) && !navbarToggler.contains(e.target) && navbarCollapse.classList.contains('show')) {
            navbarToggler.click();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    typeEffect();
    renderPortfolio();
    initNavbarAutoClose();
    document.getElementById('current-year').textContent = new Date().getFullYear();
});

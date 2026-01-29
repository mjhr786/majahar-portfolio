function toggleMenu(){
  const links = document.getElementById('nav-links');
  const btn = document.querySelector('.hamburger');
  const isOpen = links.classList.toggle('show');
  btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
}

// Load dynamic content
fetch('assets/data/site.json')
  .then(r => r.json())
  .then(data => {
    // Summary bullets
    const bullets = document.getElementById('summary-bullets');
    data.summary.bullets.forEach(b => {
      const li = document.createElement('li');
      li.textContent = b;
      li.classList.add('mb-2');
      li.classList.add('list-group-item');
      bullets.appendChild(li);
    });

    // Social buttons
    document.getElementById('github-btn').href = data.social.github;
    document.getElementById('linkedin-btn').href = data.social.linkedin;

    // Experience
    const expRoot = document.getElementById('experience-list');
    data.experience.forEach(e => {
      const card = document.createElement('div');
      card.className = 'col-md-12';

      card.innerHTML = `
        <div class="card shadow-sm border-0">
            <div class="card-body">
                <h5 class="card-title text-primary mb-1">${e.title}</h5>
                <p class="text-muted mb-2">${e.period} | <i><a href="${e.companyUrl}" target="_blank">${e.org}, ${e.location}</a></i></p>
            </div>
        </div>`;
      expRoot.appendChild(card);
    });

    // Skills
    const skillsRoot = document.getElementById('skills-grid');
    data.skills.forEach(s => {
      const card = document.createElement('div');
      card.className = 'col-md-4';
      card.innerHTML = `
        <div class="card h-100">
            <div class="card-body">
                <h5 class="card-title text-primary">${s.group}</h5>
                <ul class="mb-0">
                    ${s.items.map(i => `<li>${i}</li>`).join('')}
                </ul>
            </div>
        </div>`;
      skillsRoot.appendChild(card);
    });

    // Projects
    const projRoot = document.getElementById('projects-grid');
    data.projects.forEach(p => {
      const card = document.createElement('div');
      card.className = 'col-md-6 col-lg-4';
      card.innerHTML = `
            <div class="card h-100 project-card">
                <div class="card-body">
                    <h4 class="card-title">${p.name}</h4>
                    <p class="card-text small">
                        <strong>Client:</strong> ${p.client}<br>
                        <strong>Organization:</strong> ${p.org}<br>
                        <strong>Tech:</strong> ${p.stack.join(', ')}
                    </p>
                    <p class="card-text">
                        ${p.description}
                    </p>
                    <ul class="small mb-3">
                        ${p.highlights.map(i => `<li>${i}</li>`).join('')}
                    </ul>
                </div>
            </div>`;
      projRoot.appendChild(card);
    });

    // Trainings
    const trainRoot = document.getElementById('trainings-grid');
    data.trainings.forEach(t => {
      const card = document.createElement('div');
      card.className = 'col-md-4';
      card.innerHTML = `
            <div class="card h-100 shadow-sm">
                <div class="card-body">
                    <h5 class="card-title text-primary">${t.title}</h5>
                    <p class="card-text">
                        ${t.summary}
                    </p>
                </div>
                <div class="text-center pb-2">
                  <a target="_blank" class="btn btn-outline-primary" id="github-btn" onclick="openPdf('${t.path}')">View</a>
                </div>
            </div>`;
      trainRoot.appendChild(card);
    });

    // Contact
    const email = document.getElementById('contact-email');
    const phone = document.getElementById('contact-phone');
    email.href = `mailto:${data.contact.email}`; email.textContent = data.contact.email;
    phone.textContent = data.contact.phone || '';

    document.getElementById('year').textContent = new Date().getFullYear();
  })
  .catch(err => console.error('Failed to load site.json', err));

// Rotating hero subtitle effect with typing and erasing animation
const heroRoles = ["Problem Solver", "Full Stack Developer", "Technical Lead"];
let heroRoleIdx = 0;
const heroRoleSpan = document.getElementById('hero-rotating-role');

function typeRoleText(text, el, cb) {
  el.textContent = '';
  let i = 0;
  function typeNext() {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
      setTimeout(typeNext, 70);
    } else if (cb) {
      cb();
    }
  }
  typeNext();
}

function eraseRoleText(el, cb) {
  let text = el.textContent;
  function eraseNext() {
    if (text.length > 0) {
      text = text.slice(0, -1);
      el.textContent = text;
      setTimeout(eraseNext, 40);
    } else if (cb) {
      cb();
    }
  }
  eraseNext();
}

if (heroRoleSpan) {
  function showNextRole() {
    setTimeout(() => {
      eraseRoleText(heroRoleSpan, () => {
        heroRoleIdx = (heroRoleIdx + 1) % heroRoles.length;
        setTimeout(() => {
          typeRoleText(heroRoles[heroRoleIdx], heroRoleSpan, () => {
            setTimeout(showNextRole, 1200);
          });
        }, 200);
      });
    }, 1000);
  }
  // Initial load
  typeRoleText(heroRoles[0], heroRoleSpan, () => {
    setTimeout(showNextRole, 1200);
  });
}

function sendMail(e){
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const msg = document.getElementById('message').value.trim();
  if(!name || !email || !msg){ alert('Please fill all fields.'); return false; }
  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`${msg}\n\nFrom: ${name} <${email}>`);
  const mail = document.getElementById('contact-email').textContent;
  window.location.href = `mailto:${mail}?subject=${subject}&body=${body}`;
  return false;
}

function openPdf(pdfPath) {
  console.log("Opening PDF...", pdfPath);
    //Define the relative path to your PDF file within the project directory
    var pdfPath = 'assets/data/' + pdfPath ; 
    
    // Open the PDF in a new browser tab/window
    window.open(pdfPath, '_blank');
}

// Close navbar on outside click (for mobile)
document.addEventListener('click', function(event) {
  const nav = document.getElementById('nav');
  const navbarToggler = document.querySelector('.navbar-toggler');
  if (!nav || !navbarToggler) return;
  const isOpen = nav.classList.contains('show');
  if (isOpen && !nav.contains(event.target) && !navbarToggler.contains(event.target)) {
    navbarToggler.click();
  }
});


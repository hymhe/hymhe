/* HYMHE - Healthy Young Mind for Healthy Earth JavaScript */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- DOM Elements ---
  const header = document.getElementById('main-header');
  const menuToggleBtn = document.getElementById('menu-toggle-btn');
  const navMenu = document.getElementById('navigation-menu-list');
  const navLinks = document.querySelectorAll('.nav-link');
  const revealElements = document.querySelectorAll('.reveal');
  
  // Modal Elements
  const modalOverlay = document.getElementById('join-movement-modal-overlay');
  const modalBox = document.getElementById('join-movement-modal-box');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const joinTriggers = document.querySelectorAll('.join-movement-trigger');
  const signupForm = document.getElementById('hymhe-join-signup-form');
  const formContent = document.getElementById('modal-form-content');
  const successScreen = document.getElementById('modal-success-screen');
  const successCloseBtn = document.getElementById('success-screen-close-btn');

  // --- Mobile Navigation Drawer Menu ---
  let isMenuOpen = false;

  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    navMenu.classList.toggle('active');
    
    // Toggle hamburger / close icon
    const hamburgerIcon = menuToggleBtn.querySelector('i');
    if (hamburgerIcon) {
      if (isMenuOpen) {
        hamburgerIcon.setAttribute('data-lucide', 'x');
      } else {
        hamburgerIcon.setAttribute('data-lucide', 'menu');
      }
      if (typeof lucide !== 'undefined') {
        lucide.createIcons(); // Reclear icons to swap svg elements
      }
    }
  }

  menuToggleBtn.addEventListener('click', toggleMenu);

  // Close mobile nav when link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (isMenuOpen) toggleMenu();
    });
  });

  // --- Sticky Header Scrolled Effect ---
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Scroll Active Sections Highlighting in Navbar ---
  const sections = document.querySelectorAll('section');
  
  function highlightNavigationLinks() {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 250; // offset for triggers

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // Special check for bottom of page to highlight "Join Us" if scrolled to bottom
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
      currentSectionId = 'join';
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      const hrefValue = link.getAttribute('href').substring(1);
      if (hrefValue === currentSectionId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNavigationLinks);
  highlightNavigationLinks();

  // --- Scroll Reveal Animations Observer ---
  const revealObserverOptions = {
    root: null, // viewport
    threshold: 0.1, // trigger when 10% is visible
    rootMargin: '0px 0px -50px 0px' // offset bottom triggers slightly
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once revealed to keep layout responsive and reduce observers load
        observer.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // --- Modal Signup Box Trigger Actions ---
  function openModal() {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop page scrolling
    formContent.style.display = 'block';
    successScreen.classList.remove('active');
    signupForm.reset();
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Resume scrolling
  }

  joinTriggers.forEach(trigger => {
    trigger.addEventListener('click', openModal);
  });

  closeModalBtn.addEventListener('click', closeModal);
  successCloseBtn.addEventListener('click', closeModal);

  // Close modal when click happens outside modal-box (overlay background)
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Close modal on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      closeModal();
    }
  });

  // Form Submit Submission Handling
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate application processing / onboarding dispatch
    const name = document.getElementById('form-input-name').value;
    const email = document.getElementById('form-input-email').value;
    const role = document.getElementById('form-input-role').value;
    const motivation = document.getElementById('form-input-motivation').value;

    console.log('HYMHE Signup Form Submission:', { name, email, role, motivation });
    
    // Transition to success screen layout inside modal
    formContent.style.display = 'none';
    successScreen.classList.add('active');
  });

  // --- Canvas Connected Particle Network (Hero Section) ---
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    const maxParticles = 40; // Low amount to keep it elegant and performant
    const connectionDistance = 110;
    
    // Mouse coords
    let mouse = {
      x: null,
      y: null,
      radius: 140
    };

    // Resizing canvas helper
    function resizeCanvas() {
      const container = canvas.parentElement;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      initParticles();
    }

    // Particle Object Blueprint
    class Particle {
      constructor(x, y) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height;
        // Speeds: very slow floating to enhance, not dominate
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        // Node styling
        this.radius = Math.random() * 2 + 1.5;
        // Palette mapping: either accent blue or primary green
        this.color = Math.random() > 0.5 ? '#22C55E' : '#2563EB';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Boundaries checks: soft wrap around margins
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        // Mouse hover interactions: pull particles slightly
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < mouse.radius) {
            // Apply a minor pull force
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= dx * force * 0.02;
            this.y -= dy * force * 0.02;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        // Draw glow effect for particles
        ctx.shadowBlur = 4;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow
      }
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
      }
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            // Fade lines as they grow further apart
            const opacity = (1 - (dist / connectionDistance)) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(107, 114, 128, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Draw connections to mouse cursor
        if (mouse.x !== null && mouse.y !== null) {
          const p = particles[i];
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const opacity = (1 - (dist / mouse.radius)) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            // Color connection depending on particle color
            ctx.strokeStyle = p.color === '#22C55E' ? `rgba(34, 197, 94, ${opacity})` : `rgba(37, 99, 235, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update & Draw all particles
      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Draw interactive connections
      drawConnections();

      animationFrameId = requestAnimationFrame(animate);
    }

    // Mouse Listeners
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Touch Support for mobile (brief coordinates capture)
    canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
      }
    });

    canvas.addEventListener('touchend', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Initial setup and loop start
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
  }
});

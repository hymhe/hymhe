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
    // Check if we are on the main page (has hero section) to run section highlighting
    const hasHero = document.getElementById('hero');
    if (!hasHero) {
      return;
    }

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
      const href = link.getAttribute('href');
      // Only manage active state for page-local anchor links starting with '#'
      if (href && href.startsWith('#')) {
        link.classList.remove('active');
        if (href.substring(1) === currentSectionId) {
          link.classList.add('active');
        }
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

  // --- Toast Notification System ---
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  function showToast(title, message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconClass = type === 'success' ? 'fa-solid fa-circle-check' : 'fa-solid fa-triangle-exclamation';
    
    toast.innerHTML = `
      <i class="${iconClass} toast-icon"></i>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Dismiss Notification">&times;</button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Trigger fade/slide-in
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // Auto dismiss after 4 seconds
    const autoDismissTimeout = setTimeout(() => {
      dismissToast(toast);
    }, 4000);
    
    // Manual close button listener
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
      clearTimeout(autoDismissTimeout);
      dismissToast(toast);
    });
  }

  function dismissToast(toast) {
    toast.classList.remove('show');
    // Remove from DOM after transition finishes
    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }

  // --- Input Validation System ---
  const nameInput = document.getElementById('form-input-name');
  const emailInput = document.getElementById('form-input-email');
  const roleSelect = document.getElementById('form-input-role');
  const motivationText = document.getElementById('form-input-motivation');

  // Helper to ensure error container spans exist
  function initErrorContainers() {
    [nameInput, emailInput, roleSelect, motivationText].forEach(input => {
      if (!input) return;
      let errSpan = input.parentElement.querySelector('.error-message');
      if (!errSpan) {
        errSpan = document.createElement('span');
        errSpan.className = 'error-message';
        errSpan.id = `error-${input.id}`;
        input.parentElement.appendChild(errSpan);
      }
      
      // Clear error state on input/change
      input.addEventListener('input', () => clearError(input));
      if (input.tagName === 'SELECT') {
        input.addEventListener('change', () => clearError(input));
      }
    });
  }

  function showError(input, message) {
    if (!input) return;
    input.classList.add('error');
    const errSpan = input.parentElement.querySelector('.error-message');
    if (errSpan) {
      errSpan.textContent = message;
      errSpan.classList.add('active');
    }
  }

  function clearError(input) {
    if (!input) return;
    input.classList.remove('error');
    const errSpan = input.parentElement.querySelector('.error-message');
    if (errSpan) {
      errSpan.textContent = '';
      errSpan.classList.remove('active');
    }
  }

  function clearAllErrors() {
    [nameInput, emailInput, roleSelect, motivationText].forEach(input => {
      clearError(input);
    });
  }

  function validateForm() {
    let isValid = true;
    
    // 1. Name Validation
    if (!nameInput.value || nameInput.value.trim().length === 0) {
      showError(nameInput, "Please enter your full name.");
      isValid = false;
    } else if (nameInput.value.trim().length < 3) {
      showError(nameInput, "Full name must be at least 3 characters long.");
      isValid = false;
    } else {
      clearError(nameInput);
    }
    
    // 2. Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value || emailInput.value.trim().length === 0) {
      showError(emailInput, "Please enter your email address.");
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, "Please enter a valid email address.");
      isValid = false;
    } else {
      clearError(emailInput);
    }
    
    // 3. Role Validation
    if (!roleSelect.value || roleSelect.value === "") {
      showError(roleSelect, "Please select an interest area.");
      isValid = false;
    } else {
      clearError(roleSelect);
    }
    
    // 4. Motivation Validation
    const motivationVal = motivationText.value ? motivationText.value.trim() : "";
    if (motivationVal.length === 0) {
      showError(motivationText, "Please tell us why you would like to join HYMHE.");
      isValid = false;
    } else if (motivationVal.length < 15) {
      showError(motivationText, "Please provide at least 15 characters.");
      isValid = false;
    } else if (motivationVal.length > 500) {
      showError(motivationText, "Motivation must not exceed 500 characters.");
      isValid = false;
    } else {
      clearError(motivationText);
    }
    
    return isValid;
  }

  // --- Focus Trap & Accessibility ---
  let lastActiveElement = null;

  function setupFocusTrap(modalEl) {
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex="0"]';
    
    modalEl.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      
      const focusableEls = Array.from(modalEl.querySelectorAll(focusableSelectors))
                                .filter(el => !el.disabled && el.style.display !== 'none');
      if (focusableEls.length === 0) return;
      
      const firstEl = focusableEls[0];
      const lastEl = focusableEls[focusableEls.length - 1];
      
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          lastEl.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastEl) {
          firstEl.focus();
          e.preventDefault();
        }
      }
    });
  }

  // Initialize error spans and focus trap
  initErrorContainers();
  if (modalBox) {
    setupFocusTrap(modalBox);
  }

  // --- Modal Signup Box Trigger Actions ---
  function openModal() {
    lastActiveElement = document.activeElement;
    clearAllErrors();
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop page scrolling
    formContent.style.display = 'block';
    successScreen.classList.remove('active');
    signupForm.reset();
    
    // Focus first input
    setTimeout(() => {
      if (nameInput) nameInput.focus();
    }, 150);
  }

  function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Resume scrolling
    
    // Return focus to previous active element
    if (lastActiveElement) {
      lastActiveElement.focus();
    }
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
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // 1. Validate all fields first
      if (!validateForm()) {
        return;
      }
      
      // Loading State
      const submitBtn = document.getElementById('form-submit-btn');
      const originalBtnContent = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="btn-spinner"></span> Submitting...`;
      
      // Fields mapping
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const role = roleSelect.value;
      const motivation = motivationText.value.trim();
      
      // Debugging logs before submission
      console.log({
        name,
        email,
        role,
        motivation
      });
      
      // 2. Submit using FormData
      const formData = new FormData();
      formData.append('entry.1192649635', name);
      formData.append('entry.1976754613', email);
      formData.append('entry.664220548', role);
      formData.append('entry.793342974', motivation);
      
      // Google Form URL
      const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSe8QKsFWCWDJrEhMM_ikYhJJLJuCwoqIMqDJ8MtySlcO3O5kw/formResponse';
      
      // Submit responses directly to Google Form
      fetch(googleFormUrl, {
        method: 'POST',
        mode: 'no-cors', // Submit silently avoiding CORS block
        body: formData
      })
      .then((response) => {
        // Restore submit button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
        
        // Clear form inputs
        signupForm.reset();
        
        // Close modal
        closeModal();
        
        // Show success toast
        showToast(
          "Application Submitted Successfully", 
          "Thank you for your interest in HYMHE. Our team will review your application and contact you soon.", 
          "success"
        );
      })
      .catch((error) => {
        console.error('Google Form Submission Error:', error);
        
        // Restore submit button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnContent;
        
        // Show error toast
        showToast(
          "Submission Failed", 
          "Your application could not be submitted. Please try again later or contact us directly.", 
          "error"
        );
      });
    });
  }

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

  // --- FAQ Accordion Interactivity ---
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  if (faqQuestions.length > 0) {
    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        const item = question.parentElement;
        const answer = question.nextElementSibling;
        const icon = question.querySelector('.faq-toggle-btn i');
        
        // Check if item is already active
        const isActive = item.classList.contains('active');
        
        // Close all other open FAQ items in the same section for accordion behavior
        const allItems = item.parentElement.querySelectorAll('.faq-accordion-item');
        allItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) {
              otherAnswer.style.maxHeight = null;
            }
            const otherIcon = otherItem.querySelector('.faq-toggle-btn i');
            if (otherIcon) {
              otherIcon.setAttribute('class', 'fa-solid fa-plus');
            }
          }
        });
        
        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
          if (icon) {
            icon.setAttribute('class', 'fa-solid fa-plus');
          }
        } else {
          item.classList.add('active');
          // Set max-height dynamically using scrollHeight
          answer.style.maxHeight = answer.scrollHeight + 'px';
          if (icon) {
            icon.setAttribute('class', 'fa-solid fa-minus');
          }
        }
      });
    });
  }
});

/* ============================================
   DHITA INFO SERVICES — Main Script
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile Nav Toggle ---------- */
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu   = document.querySelector('.nav-menu');
  const navOverlay = document.querySelector('.nav-overlay');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
      navOverlay.classList.toggle('active');
      document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Close mobile nav on link click
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  /* ---------- Sticky Header on Scroll ---------- */
  const header = document.querySelector('.header');
  const scrollThreshold = 60;

  function handleScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // initial check

  /* ---------- Active Nav Link Highlighting ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a:not(.nav-cta .btn)').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || 
        (currentPage === '' && href === 'index.html') ||
        (currentPage === '/' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ---------- Scroll-Triggered Animations ---------- */
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all elements
    animatedElements.forEach(el => el.classList.add('animated'));
  }

  /* ---------- Smooth Scroll for Anchor Links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ---------- Contact Form Validation ---------- */
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      let isValid = true;
      
      // Clear previous errors
      this.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
      });
      
      // Name validation
      const name = this.querySelector('#name');
      if (name && name.value.trim().length < 2) {
        showError(name, 'Please enter your full name');
        isValid = false;
      }
      
      // Email validation
      const email = this.querySelector('#email');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email.value.trim())) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
      }
      
      // Phone validation
      const phone = this.querySelector('#phone');
      if (phone && phone.value.trim().length > 0) {
        const phoneRegex = /^[\d\s\-\+\(\)]{7,15}$/;
        if (!phoneRegex.test(phone.value.trim())) {
          showError(phone, 'Please enter a valid phone number');
          isValid = false;
        }
      }
      
      // Subject validation
      const subject = this.querySelector('#subject');
      if (subject && subject.value.trim().length < 2) {
        showError(subject, 'Please enter a subject');
        isValid = false;
      }
      
      // Message validation
      const message = this.querySelector('#message');
      if (message && message.value.trim().length < 10) {
        showError(message, 'Message must be at least 10 characters');
        isValid = false;
      }
      
      if (isValid) {
        // Hide form, show success
        contactForm.style.display = 'none';
        const successMsg = document.querySelector('.form-success');
        if (successMsg) {
          successMsg.classList.add('show');
        }
      }
    });
  }
  
  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    const errorMsg = formGroup.querySelector('.error-msg');
    if (errorMsg) {
      errorMsg.textContent = message;
    }
  }

  /* ---------- Counter Animation (for stats) ---------- */
  function animateCounter(el, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const suffix = el.dataset.suffix || '';
    
    function update() {
      start += increment;
      if (start >= target) {
        el.textContent = target + suffix;
        return;
      }
      el.textContent = Math.floor(start) + suffix;
      requestAnimationFrame(update);
    }
    
    update();
  }

  // Observe counter elements
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.count, 10);
          animateCounter(entry.target, target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

});

/**
 * FALSON CHOCOLATE - Core Premium Interactions
 * Handles premium scroll interactions, Intersection Observer reveals, 
 * subtle image parallax, responsive menu toggling, and newsletter signup feedback.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initScrollReveals();
  initParallaxEffects();
  initNewsletterForm();
  initHeroSequence();
  initSmoothLinks();
});

/**
 * 1. Header Scroll Animation
 * Shrinks and adds blur/opacity to header upon scrolling down
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  // Run on load and on scroll
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * 2. Responsive Mobile Navigation Menu
 */
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-link');

  if (!menuToggle || !navLinks) return;

  // Create premium mobile backdrop dimmer layer
  const backdrop = document.createElement('div');
  backdrop.className = 'menu-backdrop';
  document.body.appendChild(backdrop);

  const toggleMenu = () => {
    navLinks.classList.toggle('nav-active');
    menuToggle.classList.toggle('toggle-active');
    backdrop.classList.toggle('backdrop-active');
    
    // Toggle menu state accessibility attributes
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
    menuToggle.setAttribute('aria-expanded', !expanded);

    // Premium scroll locking when mobile menu is active
    if (navLinks.classList.contains('nav-active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  menuToggle.addEventListener('click', toggleMenu);
  backdrop.addEventListener('click', toggleMenu);

  // Close menu when links are clicked
  links.forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('nav-active')) {
        toggleMenu();
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('nav-active') && 
        !navLinks.contains(e.target) && 
        !menuToggle.contains(e.target) &&
        !backdrop.contains(e.target)) {
      toggleMenu();
    }
  });
}

/**
 * 3. Intersection Observer for Scroll Reveals
 * Uses native IntersectionObserver to animate content on scroll
 */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length === 0) return;

  // Respect preferred reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    revealElements.forEach(el => el.classList.add('reveal-active'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Trigger when 15% of the element is visible
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        // Unobserve once animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
}

/**
 * 4. Premium Parallax Scroll Effects
 * Adds subtle premium vertical parallax movement to background images
 */
function initParallaxEffects() {
  const parallaxImages = document.querySelectorAll('.premium-image');
  const heroImage = document.querySelector('.hero-bg img');
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    // Hero background slow scale/scroll parallax
    if (heroImage) {
      const transformValue = `translateY(${scrollPos * 0.3}px) scale(${1.02 + scrollPos * 0.0001})`;
      heroImage.style.transform = transformValue;
    }

    // Story image scroll shift
    parallaxImages.forEach(img => {
      const container = img.closest('.premium-image-container');
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const viewHeight = window.innerHeight;

      // Only calculate if visible on screen
      if (rect.top < viewHeight && rect.bottom > 0) {
        const offset = (rect.top - viewHeight / 2) * 0.08;
        img.style.transform = `translateY(${offset}px) scale(1.05)`;
      }
    });
  }, { passive: true });
}

/**
 * 5. Luxury Newsletter Sign-up Mock Action
 */
function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  const input = document.getElementById('newsletter-email');
  const messageElement = document.getElementById('newsletter-message');

  if (!form || !input || !messageElement) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = input.value.trim();

    // Reset status
    messageElement.className = 'cta-msg';
    messageElement.textContent = '';

    if (!email) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showStatus('Please enter a valid email format.', 'error');
      return;
    }

    // Luxury loading feedback
    const submitBtn = form.querySelector('.btn-premium');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Enrolling...';
    submitBtn.disabled = true;

    // Simulate luxury API response
    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      
      // Complete success transition
      input.value = '';
      showStatus('Welcome to the elite collective. A confirmation is on its way.', 'success');
    }, 1500);
  });

  function showStatus(msg, type) {
    messageElement.textContent = msg;
    messageElement.classList.add(type);
    
    // Auto clear error messages after 5 seconds
    if (type === 'error') {
      setTimeout(() => {
        if (messageElement.textContent === msg) {
          messageElement.textContent = '';
        }
      }, 5000);
    }
  }
}

/**
 * 6. Ultra-Premium Hero Sequence Animation
 * Pre-caches 80 frames and scrubs canvas based on scroll position of `.hero-scroll-container`
 */
function initHeroSequence() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const scrollContainer = document.querySelector('.hero-scroll-container');
  const heroContent = document.querySelector('.hero-content');
  if (!scrollContainer || !ctx) return;

  const frameCount = 80;
  const images = [];
  let currentFrameIndex = 0;

  // Casing matches "choclate blast effect"
  const getFrameUrl = (index) => {
    const pad = String(index).padStart(3, '0');
    return `hero/choclate blast effect _000/choclate blast effect _${pad}.jpg`;
  };

  // Helper to draw image using "object-fit: cover" aspect logic inside canvas
  const drawImageCover = (img) => {
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    
    if (canvasWidth === 0 || canvasHeight === 0 || imgWidth === 0 || imgHeight === 0) return;
    
    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;
    
    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;
    
    if (canvasRatio > imgRatio) {
      // Canvas is wider than image
      drawHeight = canvasWidth / imgRatio;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      // Canvas is taller than image
      drawWidth = canvasHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
    }
    
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Handle resizing for high-density screens
  const resizeCanvas = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    
    if (images[currentFrameIndex] && images[currentFrameIndex].complete) {
      drawImageCover(images[currentFrameIndex]);
    }
  };

  // Load first frame immediately for instant first paint
  const firstImg = new Image();
  firstImg.src = getFrameUrl(0);
  images[0] = firstImg;
  firstImg.onload = () => {
    resizeCanvas();
  };

  // Pre-load the remaining frames in the background
  for (let i = 1; i < frameCount; i++) {
    const img = new Image();
    img.src = getFrameUrl(i);
    images[i] = img;
  }

  let targetProgress = 0;
  let currentProgress = 0;
  let animationFrameId = null;

  // Scroll scrubbing logic - updates targeted scroll depth
  const handleScroll = () => {
    const rect = scrollContainer.getBoundingClientRect();
    const totalScrollHeight = rect.height - window.innerHeight;
    
    if (totalScrollHeight > 0) {
      const prog = -rect.top / totalScrollHeight;
      targetProgress = Math.max(0, Math.min(1, prog));
    }
    
    // Launch smooth drawing loop if not already running
    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(tick);
    }
  };

  // The premium lerp loop tick function
  const tick = () => {
    // Luxurious ultra-smooth momentum ease-out formula
    const diff = targetProgress - currentProgress;
    currentProgress += diff * 0.05;

    // Shut down drawing frame loop if target is fully snapped
    if (Math.abs(diff) < 0.0001) {
      currentProgress = targetProgress;
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    } else {
      animationFrameId = requestAnimationFrame(tick);
    }

    // Determine target frame index based on current interpolated progress
    const targetFrame = Math.min(frameCount - 1, Math.floor(currentProgress * frameCount));
    
    if (targetFrame !== currentFrameIndex) {
      currentFrameIndex = targetFrame;
      if (images[targetFrame] && images[targetFrame].complete) {
        drawImageCover(images[targetFrame]);
      }
    }

    // Apply a premium cinematic 3D zoom scaling and dynamic backlight brightness based on scroll depth
    if (canvas) {
      const brightness = 0.42 + currentProgress * 0.33; // Scales brightness from 42% (high contrast text backing) up to 75%
      const contrast = 1.0 + currentProgress * 0.08;   // Gently scales contrast to make the splash pop
      canvas.style.transform = `translate(-50%, -50%) scale(${1 + currentProgress * 0.12})`;
      canvas.style.filter = `brightness(${brightness}) contrast(${contrast})`;
    }

    // Sync flaring golden studio backlight to the conching blast peak (sinusoidal bell curve peaking at midpoint)
    const glowOverlay = document.querySelector('.hero-glow-overlay');
    if (glowOverlay) {
      const goldIntensity = 0.15 + Math.sin(currentProgress * Math.PI) * 0.35; // flares to 50% opacity
      glowOverlay.style.background = `radial-gradient(circle at center, rgba(201, 169, 98, ${goldIntensity}) 0%, rgba(30, 16, 10, 0.95) 80%)`;
    }

    // Multi-layered typographic stagger reveals (3D spatial depth)
    if (heroContent) {
      const sub = heroContent.querySelector('.story-header');
      const title = heroContent.querySelector('.hero-title');
      const tagline = heroContent.querySelector('.hero-tagline');
      const btns = heroContent.querySelector('.hero-btn-group');

      // Disable transition animations for all scroll elements to prevent scroll lag/jitter!
      if (sub) {
        sub.style.transition = 'none';
        sub.style.opacity = Math.max(0, 1 - currentProgress * 3.5);
        sub.style.transform = `translateY(${-currentProgress * 110}px)`;
      }

      if (title) {
        title.style.transition = 'none';
        title.style.opacity = Math.max(0, 1 - currentProgress * 2.2);
        title.style.transform = `translateY(${-currentProgress * 80}px)`;
      }

      if (tagline) {
        const tagOpacity = 1 - currentProgress * 1.5;
        tagline.style.transition = 'none';
        tagline.style.opacity = Math.max(0, tagOpacity);
        tagline.style.transform = `translateY(${-currentProgress * 55}px)`;
        tagline.style.letterSpacing = `${0.05 + currentProgress * 0.08}em`;
      }

      if (btns) {
        const btnOpacity = 1 - currentProgress * 4.5;
        btns.style.transition = 'none';
        btns.style.opacity = Math.max(0, btnOpacity);
        btns.style.transform = `translateY(${-currentProgress * 35}px)`;
      }
      
      // Control pointer events
      const generalOpacity = 1 - currentProgress * 1.6;
      if (generalOpacity <= 0.05) {
        heroContent.style.pointerEvents = 'none';
      } else {
        heroContent.style.pointerEvents = 'all';
      }
    }

    // Nudge visual scroll indicator to fade out quickly once scroll action occurs
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.style.transition = 'none';
      const scrollIndicatorOpacity = 1 - (currentProgress * 6); // fades out very rapidly
      scrollIndicator.style.opacity = Math.max(0, scrollIndicatorOpacity);
      if (scrollIndicatorOpacity <= 0) {
        scrollIndicator.style.pointerEvents = 'none';
      } else {
        scrollIndicator.style.pointerEvents = 'all';
      }
    }
  };

  // Listeners
  let lastWidth = window.innerWidth;
  const handleResize = () => {
    if (window.innerWidth !== lastWidth) {
      lastWidth = window.innerWidth;
      resizeCanvas();
    }
  };
  window.addEventListener('resize', handleResize);
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Initial draw
  resizeCanvas();
  
  // Degrade gracefully if reduced motion is requested
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    // Show frame 40 (fully developed chocolate splash) and disable scroll updates
    const midImg = new Image();
    midImg.src = getFrameUrl(40);
    midImg.onload = () => {
      drawImageCover(midImg);
    };
    window.removeEventListener('scroll', handleScroll);
  }
}

/**
 * 7. Luxury Custom Smooth Scroll for Internal Anchors
 * Overrides default snappy/fast scroll with a majestic cubic ease-in-out scrolling curve
 */
function initSmoothLinks() {
  const links = document.querySelectorAll('a[href^="#"]');

  // Ease-out cubic scroll curve calculator (starts at maximum speed instantly, decelerates slowly)
  const easeOutCubic = (t, b, c, d) => {
    t /= d;
    t--;
    return c * (t * t * t + 1) + b;
  };

  const smoothScrollTo = (targetY, duration) => {
    const startY = window.scrollY || window.pageYOffset;
    const difference = targetY - startY;
    let startTime = null;

    const animateScroll = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      
      const run = easeOutCubic(timeElapsed, startY, difference, duration);
      window.scrollTo(0, run);

      if (timeElapsed < duration) {
        requestAnimationFrame(animateScroll);
      } else {
        window.scrollTo(0, targetY);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      if (href === '#') {
        e.preventDefault();
        smoothScrollTo(0, 1000); // Snappy scroll back to top over 1.0 second, instantly responsive!
        return;
      }

      if (href.startsWith('#')) {
        const targetElement = document.querySelector(href);
        if (targetElement) {
          e.preventDefault();
          
          let targetY = targetElement.getBoundingClientRect().top + window.scrollY;
          
          // Deduct header height if sticky scrolled is active
          const header = document.querySelector('.header');
          if (header) {
            targetY -= 64; // subtract scrolled header height for perfect alignment
          }

          // Differentiate scroll timing: "Savor" indicator scrolls slow (2.8s), nav links scroll fast and responsive (0.8s - 1.2s)!
          const isSavorIndicator = link.classList.contains('scroll-indicator') || link.closest('.scroll-indicator');
          let calculatedDuration = 1000; // Snappy default for nav links and buttons

          if (isSavorIndicator) {
            calculatedDuration = 2800; // Majestic slow scroll for the Savor explosion showcase
          } else {
            // Standard links scale between 800ms and 1300ms depending on distance, avoiding long crawl lag
            const distance = Math.abs(targetY - window.scrollY);
            calculatedDuration = Math.min(1300, Math.max(800, distance * 0.25));
          }
          
          smoothScrollTo(targetY, calculatedDuration);
        }
      }
    });
  });
}

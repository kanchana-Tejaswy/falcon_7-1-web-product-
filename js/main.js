/**
 * FALSON CHOCOLATE - Architectural Interaction Engine
 * World-class motion design and interaction logic.
 */

// core initialization
const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

document.addEventListener('DOMContentLoaded', () => {
  // core initialization
  const engine = new FalsonEngine();
  engine.init();
});

class FalsonEngine {
  constructor() {
    this.lerpAmount = 0.085; 
    this.mouse = { x: 0, y: 0, currX: 0, currY: 0 };
    this.scroll = { target: 0, current: 0 };
    this.isMobile = window.matchMedia('(pointer: coarse)').matches;
    this.state = { cart: [] };
    this.introPlaying = false;
    
    // Performance Cache
    this.ui = {
      cursor: document.querySelector('.custom-cursor'),
      heroContent: document.querySelector('.hero-content'),
      scrollContainer: document.querySelector('.hero-scroll-container'),
      progressBar: document.getElementById('hero-progress-bar'),
      scrollIndicator: document.querySelector('.scroll-indicator'),
      heroLayers: {}
    };

    if (this.ui.heroContent) {
      ['kicker', 'title', 'separator', 'tagline', 'btn-group'].forEach(key => {
        const selector = `.hero-${key === 'btn-group' ? 'btn-group' : key}`;
        this.ui.heroLayers[key] = this.ui.heroContent.querySelector(selector);
      });
    }
  }

  init() {
    this.initHeader();
    this.initNavigation();
    this.initScrollReveals();
    this.initParallax();
    this.initHeroSequence();
    this.initForms();
    this.initDrawer();
    this.initSmoothLinks();
    this.initActiveNav();
    
    if (!this.isMobile) {
      this.initBespokeInteractions();
    }
    
    this.tick();
    window.addEventListener('resize', () => this.onResize(), { passive: true });
  }

  /**
   * 1. Header & Navigation Logic
   */
  initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      header.classList.toggle('header-scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  initNavigation() {
    const menuToggle = document.querySelector('.menu-toggle:not(#drawer-trigger)');
    const navLinks = document.querySelector('.nav-links');
    const backdrop = document.getElementById('menu-backdrop');
    if (!menuToggle || !navLinks) return;

    const toggleMenu = () => {
      const isActive = navLinks.classList.toggle('nav-active');
      menuToggle.classList.toggle('toggle-active');
      if (backdrop) {
        backdrop.classList.toggle('backdrop-active', isActive);
      }
      document.body.style.overflow = isActive ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', toggleMenu);
    if (backdrop) {
      backdrop.addEventListener('click', toggleMenu);
    }
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.contains('nav-active') && toggleMenu());
    });
  }

  initSmoothLinks() {
    const ease = (t, b, c, d) => { t /= d; t--; return c * (t * t * t + 1) + b; };
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const start = window.scrollY;
          const dest = target.getBoundingClientRect().top + start - 64;
          const diff = dest - start;
          let startT = null;
          const anim = (currT) => {
            if (!startT) startT = currT;
            const elapsed = currT - startT;
            const duration = link.classList.contains('scroll-indicator') || link.classList.contains('scroll-hint-wrap') ? 1800 : 1000;
            window.scrollTo(0, ease(elapsed, start, diff, duration));
            if (elapsed < duration) requestAnimationFrame(anim);
            else window.scrollTo(0, dest);
          };
          requestAnimationFrame(anim);
        }
      });
    });
  }

  initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.id; });
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href').includes(current)));
    }, { passive: true });
  }

  /**
   * 2. High-Performance Motion Engine
   */
  initScrollReveals() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  initParallax() {
    if (this.isMobile) return;
    this.parallaxImages = document.querySelectorAll('.premium-image');
  }

  initBespokeInteractions() {
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      if (this.ui.cursor) {
        this.ui.cursor.classList.add('cursor-visible');
      }
    }, { passive: true });

    // Custom Cursor Click State Transitions
    window.addEventListener('mousedown', () => document.body.classList.add('cursor-clicking'));
    window.addEventListener('mouseup', () => document.body.classList.remove('cursor-clicking'));

    // Custom Cursor & Magnetic Effect
    document.querySelectorAll('a, button, .product-card, .drawer-close, .menu-toggle').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
    });

    // Magnetic Buttons
    document.querySelectorAll('.btn-premium').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.45;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.45;
        btn.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
      btn.addEventListener('mouseleave', () => btn.style.transform = '');
    });
  }

  /**
   * 3. Functional Components
   */
  initDrawer() {
    const drawer = document.getElementById('acquire-drawer');
    if (!drawer) return;

    // Initialize allocations view layout state
    this.updateCartUI();

    const toggle = (open) => {
      drawer.classList.toggle('drawer-active', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };

    document.querySelectorAll('.product-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        const name = card.querySelector('.product-name').textContent;
        const price = parseFloat(card.querySelector('.product-price').textContent.replace('$', ''));
        this.addToCart({ name, price });
        toggle(true);
      });
    });

    document.getElementById('drawer-trigger').addEventListener('click', () => toggle(true));
    [document.getElementById('drawer-overlay'), document.getElementById('drawer-close')].forEach(el => {
      el.addEventListener('click', () => toggle(false));
    });

    // Solve drawer empty state click overlay trap
    const emptyStateClose = drawer.querySelector('.drawer-btn-close');
    if (emptyStateClose) {
      emptyStateClose.addEventListener('click', (e) => {
        toggle(false);
      });
    }
  }

  addToCart(item) {
    this.state.cart.push(item);
    this.updateCartUI();
  }

  updateCartUI() {
    const container = document.getElementById('drawer-items');
    const totalEl = document.querySelector('.total-price');
    const emptyState = document.querySelector('.drawer-empty-state');
    const badge = document.getElementById('cart-badge');
    const footer = document.querySelector('.drawer-footer');
    
    if (this.state.cart.length > 0) {
      if (emptyState) emptyState.style.display = 'none';
      if (footer) footer.style.display = 'block';
      if (badge) {
        badge.textContent = this.state.cart.length;
        badge.style.display = 'flex';
      }
    } else {
      if (emptyState) emptyState.style.display = 'flex';
      if (footer) footer.style.display = 'none';
      if (badge) {
        badge.style.display = 'none';
      }
    }
    
    container.innerHTML = this.state.cart.map((item, i) => `
      <div class="drawer-item-row reveal-active">
        <div class="item-info">
          <span class="item-name">${item.name}</span>
          <span class="item-price">$${item.price.toFixed(2)}</span>
        </div>
        <button class="item-remove" data-index="${i}">&times;</button>
      </div>
    `).join('');

    const total = this.state.cart.reduce((sum, item) => sum + item.price, 0);
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

    container.querySelectorAll('.item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.state.cart.splice(e.target.dataset.index, 1);
        this.updateCartUI();
      });
    });
  }

  /**
   * 4. Hero Visual Sequence
   */
  initHeroSequence() {
    this.canvas = document.getElementById('hero-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.frameCount = 80;
    this.images = [];
    this.currentFrameIndex = 0;
    this.introPlaying = false;
    
    this.loadImages();

    window.addEventListener('scroll', () => {
      if (!this.ui.scrollContainer) return;
      
      // If intro is playing, cancel it when scroll starts to ensure direct synchronization
      if (this.introPlaying) {
        this.introPlaying = false;
      }
      
      const rect = this.ui.scrollContainer.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      this.scroll.target = Math.max(0, Math.min(1, -rect.top / total));
    }, { passive: true });

    // Play luxurious intro animation on page load (if at the top)
    setTimeout(() => {
      if (window.scrollY === 0) {
        this.playIntroAnimation();
      }
    }, 200);
  }

  loadImages() {
    for (let i = 0; i < this.frameCount; i++) {
      const img = new Image();
      img.src = `hero/chocolate blast effect _000/chocolate blast effect _${String(i).padStart(3, '0')}.webp`;
      img.onload = () => {
        if (i === 0) this.onResize();
        
        // Redraw current scroll position frame immediately upon load completion to prevent flickering
        if (!this.introPlaying) {
          const currentFrame = Math.min(this.frameCount - 1, Math.floor(this.scroll.current * (this.frameCount - 1)));
          if (i === currentFrame && i !== this.currentFrameIndex) {
            this.drawFrame(img);
            this.currentFrameIndex = i;
          }
        }
      };
      this.images.push(img);
    }
  }

  playIntroAnimation() {
    this.introPlaying = true;
    let frame = 0;
    const endFrame = 40; // buildup phase of the blast sequence
    const duration = 1800; // luxurious 1.8 seconds transition
    const startTime = performance.now();

    const animate = (now) => {
      if (!this.introPlaying || window.scrollY > 20) {
        this.introPlaying = false;
        return;
      }

      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      
      // Smooth ease-out motion curve
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentFrame = Math.floor(easeProgress * endFrame);

      if (this.images[currentFrame]?.complete) {
        this.drawFrame(this.images[currentFrame]);
        this.currentFrameIndex = currentFrame;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        this.introPlaying = false;
      }
    };

    requestAnimationFrame(animate);
  }

  /**
   * 5. Main Animation Loop
   */
  tick() {
    // 1. Mouse Smooth
    this.mouse.currX = lerp(this.mouse.currX, this.mouse.x, this.lerpAmount);
    this.mouse.currY = lerp(this.mouse.currY, this.mouse.y, this.lerpAmount);

    // 2. Custom Cursor Centering
    if (this.ui.cursor) {
      this.ui.cursor.style.transform = `translate3d(${this.mouse.currX}px, ${this.mouse.currY}px, 0) translate(-50%, -50%)`;
    }

    // 3. Scroll Smooth
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, 0.12);
    this.updateHeroVisuals();

    // 4. Parallax
    if (!this.isMobile && this.parallaxImages) {
      const vh = window.innerHeight;
      this.parallaxImages.forEach(img => {
        const rect = img.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) {
          const y = (rect.top - vh/2) * 0.1;
          img.style.transform = `translate3d(0, ${y}px, 0) scale(1.05)`;
        }
      });
    }

    requestAnimationFrame(() => this.tick());
  }

  updateHeroVisuals() {
    if (this.introPlaying) return; // Leave rendering control to the cinematic intro sequence if playing

    const frame = Math.min(this.frameCount - 1, Math.floor(this.scroll.current * (this.frameCount - 1)));
    
    // Only draw if frame index changed to save GPU
    if (frame !== this.currentFrameIndex && this.images[frame]?.complete) {
      this.drawFrame(this.images[frame]);
      this.currentFrameIndex = frame;
    }

    if (this.ui.heroContent) {
      const p = this.scroll.current;
      
      // Add subtle teaser pulse at the very top (slightly more intense for visibility)
      const teaser = (window.scrollY === 0) ? Math.sin(Date.now() * 0.0025) * 0.015 : 0;
      const effectiveP = p + teaser;

      const mx = this.isMobile ? 0 : (this.mouse.currX / window.innerWidth - 0.5) * 60;
      const my = this.isMobile ? 0 : (this.mouse.currY / window.innerHeight - 0.5) * 60;
      
      this.ui.heroContent.style.transform = `translate3d(${mx}px, ${my}px, 0)`;

      const config = {
        kicker: [3.5, 140, 200, 25],
        title: [2.2, 100, 400, 20, 1.15],
        separator: [2.8, 0, 0, 0, 1, true],
        tagline: [1.8, 70, 300, 15],
        'btn-group': [4.5, 45, 150, 0, 0.85]
      };

      Object.entries(config).forEach(([key, [oMult, y, z, r, sMult = 1, isSep = false]]) => {
        const el = this.ui.heroLayers[key];
        if (!el) return;

        el.style.opacity = Math.max(0, 1 - effectiveP * oMult);
        if (isSep) {
          el.style.transform = `scaleX(${1 - effectiveP * 0.6})`;
        } else {
          el.style.transform = `translate3d(0, ${-effectiveP * y}px, ${-effectiveP * z}px) rotateX(${effectiveP * r}deg) scale(${1 + effectiveP * (sMult - 1)})`;
        }
      });
    }

    const sh = document.querySelector('.scroll-hint-wrap');
    if (sh) {
      const op = 1 - (this.scroll.current * 6);
      sh.style.opacity = Math.max(0, op);
      sh.style.pointerEvents = op <= 0 ? 'none' : 'all';
    }

    if (this.ui.progressBar) {
      this.ui.progressBar.style.width = `${this.scroll.current * 100}%`;
    }
    
    if (this.canvas) {
      this.canvas.style.filter = `brightness(${0.4 + this.scroll.current * 0.5}) contrast(1.1)`;
      this.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${1 + this.scroll.current * 0.15})`;
    }
  }

  drawFrame(img) {
    const cw = this.canvas.width, ch = this.canvas.height;
    const iw = img.naturalWidth, ih = img.naturalHeight;
    
    let ratio;
    if (this.isMobile || ch > cw) {
      // In portrait/mobile view, standard cover crops the sides of the blast by ~75%.
      // Instead, we fit the width of the image to the canvas, scaled up by a premium visual scale factor (1.45x).
      // This keeps the horizontal blast sequence mostly visible on narrow screens while maintaining high visual impact.
      const fitWidthRatio = cw / iw;
      ratio = fitWidthRatio * 1.45;
      
      // Ensure it doesn't get smaller than 45% of the viewport height to maintain dramatic scale
      const minHeightRatio = (ch * 0.45) / ih;
      if (ratio < minHeightRatio) {
        ratio = minHeightRatio;
      }
      
      // Ensure we never zoom in more than the cover ratio
      const coverRatio = Math.max(cw / iw, ch / ih);
      if (ratio > coverRatio) {
        ratio = coverRatio;
      }
    } else {
      // Desktop / Landscape - Full cinematic coverage
      ratio = Math.max(cw / iw, ch / ih);
    }
    
    const nw = iw * ratio, nh = ih * ratio;
    this.ctx.clearRect(0, 0, cw, ch);
    this.ctx.drawImage(img, (cw - nw) / 2, (ch - nh) / 2, nw, nh);
  }

  onResize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth * window.devicePixelRatio;
    this.canvas.height = window.innerHeight * window.devicePixelRatio;
    
    // Instantly redraw the active frame to avoid black flickers on window resize
    if (this.currentFrameIndex !== undefined && this.images[this.currentFrameIndex]?.complete) {
      this.drawFrame(this.images[this.currentFrameIndex]);
    }
  }

  initForms() {
    const form = document.getElementById('newsletter-form');
    const msgEl = document.getElementById('newsletter-message');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletter-email').value;
      if (!email) return;
      
      const btn = form.querySelector('button');
      btn.textContent = 'Enrolling...';
      btn.disabled = true;
      
      setTimeout(() => { 
        btn.textContent = 'Enrolled'; 
        btn.classList.add('btn-gold'); 
        if (msgEl) {
          msgEl.textContent = 'Welcome to the inner circle. Your priority access is secured.';
          msgEl.style.opacity = '1';
        }
      }, 1200);
    });
  }
}

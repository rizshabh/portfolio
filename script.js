document.addEventListener('DOMContentLoaded', () => {
  // Initialize loader flow: add loading state to body
  document.body.classList.add('loading');

  // Animate the percentage counter to match the progress bar (1850ms)
  const pct = document.querySelector('.loader-percent');
  if (pct) {
    const duration = 1850;
    const start = performance.now();
    function updatePct(now) {
      const elapsed = Math.min(now - start, duration);
      const value = Math.round((elapsed / duration) * 100);
      pct.textContent = value + '%';
      if (elapsed < duration) requestAnimationFrame(updatePct);
    }
    requestAnimationFrame(updatePct);
  }

  // Fade out loader overlay after boot animation completes
  setTimeout(() => {
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
  }, 2200);

  // Remove loader completely from DOM after fade-out transition
  setTimeout(() => {
    const loader = document.getElementById('intro-loader');
    if (loader) loader.remove();
    const loaderBg = document.getElementById('intro-loader-bg');
    if (loaderBg) loaderBg.remove();
  }, 2800);

  // ── DYNAMIC AUDIO UI SYNTHESIZER (WEB AUDIO API) ──
  let audioCtx = null;

  function initAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSynthSound(type) {
    try {
      initAudioContext();
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      const now = audioCtx.currentTime;

      if (type === 'hover') {
        // Futuristic amethyst click tick
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now); // B5 note
        osc.frequency.exponentialRampToValueAtTime(1318.51, now + 0.04);
        gain.gain.setValueAtTime(0.012, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'click') {
        // Futuristic space tap sound
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5 note
        osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.07); // G5 note
        gain.gain.setValueAtTime(0.035, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

        osc.start(now);
        osc.stop(now + 0.07);
      } else if (type === 'success') {
        // High-end digital chime arpeggio
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.07); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.14); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.21); // C6
        gain.gain.setValueAtTime(0.025, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.start(now);
        osc.stop(now + 0.35);
      }
    } catch (error) {
      // Audio autoplay restrictions
    }
  }

  // ── MOBILE TOUCH VIBRATION FEEDBACK ──
  function triggerHaptic(ms = 15) {
    if (navigator.vibrate) {
      try {
        navigator.vibrate(ms);
      } catch (err) {
        // Vibration blocked
      }
    }
  }

  // Hook interaction listeners for sounds & haptics
  const interactiveTargets = document.querySelectorAll('a, button, .nav-item, .circular-wheel-item, .project-card, .praise-card, .social-link, .skill-tags span, .hero-photo-card');
  
  interactiveTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      playSynthSound('hover');
    });

    el.addEventListener('click', () => {
      playSynthSound('click');
      triggerHaptic(15);
    });
  });

  // Enable AudioContext on first scroll/touch interaction
  const initEvents = ['scroll', 'click', 'mousemove', 'touchstart'];
  const initHandler = () => {
    initAudioContext();
    initEvents.forEach(evt => window.removeEventListener(evt, initHandler));
  };
  initEvents.forEach(evt => window.addEventListener(evt, initHandler));


  // ── INTERACTIVE CANVAS BACKGROUND WITH FLOATING CODER SYMBOLS ──
  const bgCanvas = document.getElementById('bg-canvas');
  if (bgCanvas) {
    const ctx = bgCanvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let isTabActive = true;
    let mouseX = -9999;
    let mouseY = -9999;

    // Config
    const maxParticles = 65;
    const connectDistance = 110;
    const cursorRadius = 140;

    // Tech assets
    const languages = ['React', 'Node.js', 'Python', 'TypeScript', 'Next.js', 'PostgreSQL', 'Docker', 'Firebase', 'MongoDB', 'SQL', 'JWT'];
    const iconTypes = ['brackets', 'terminal', 'database', 'cloud', 'server', 'cog'];

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
      mouseX = -9999;
      mouseY = -9999;
    });

    function drawVectorIcon(ctx, x, y, size, type) {
      ctx.beginPath();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(54, 125, 138, 0.65)'; // Theme accent with transparency
      
      if (type === 'brackets') {
        // Left bracket '<'
        ctx.moveTo(x - size * 0.35, y);
        ctx.lineTo(x - size * 0.1, y - size * 0.35);
        ctx.moveTo(x - size * 0.35, y);
        ctx.lineTo(x - size * 0.1, y + size * 0.35);
        // Right bracket '>'
        ctx.moveTo(x + size * 0.35, y);
        ctx.lineTo(x + size * 0.1, y - size * 0.35);
        ctx.moveTo(x + size * 0.35, y);
        ctx.lineTo(x + size * 0.1, y + size * 0.35);
        // Slash '/'
        ctx.moveTo(x - size * 0.05, y + size * 0.4);
        ctx.lineTo(x + size * 0.05, y - size * 0.4);
        ctx.stroke();
      } 
      else if (type === 'terminal') {
        // Prompt '>'
        ctx.moveTo(x - size * 0.3, y - size * 0.25);
        ctx.lineTo(x - size * 0.05, y);
        ctx.lineTo(x - size * 0.3, y + size * 0.25);
        // Cursor '_'
        ctx.moveTo(x + size * 0.05, y + size * 0.25);
        ctx.lineTo(x + size * 0.3, y + size * 0.25);
        ctx.stroke();
      }
      else if (type === 'database') {
        const rx = size * 0.3;
        const ry = size * 0.12;
        // Top ellipse
        ctx.ellipse(x, y - size * 0.22, rx, ry, 0, 0, Math.PI * 2);
        // Middle ellipse curve
        ctx.moveTo(x - rx, y);
        ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI);
        // Bottom ellipse curve
        ctx.moveTo(x - rx, y + size * 0.22);
        ctx.ellipse(x, y + size * 0.22, rx, ry, 0, 0, Math.PI);
        // Sides
        ctx.moveTo(x - rx, y - size * 0.22);
        ctx.lineTo(x - rx, y + size * 0.22);
        ctx.moveTo(x + rx, y - size * 0.22);
        ctx.lineTo(x + rx, y + size * 0.22);
        ctx.stroke();
      }
      else if (type === 'cloud') {
        const r = size * 0.18;
        ctx.arc(x - size * 0.18, y + size * 0.08, r, Math.PI * 0.5, Math.PI * 1.5);
        ctx.arc(x, y - size * 0.08, r * 1.2, Math.PI * 1.0, Math.PI * 2.0);
        ctx.arc(x + size * 0.18, y + size * 0.08, r, Math.PI * 1.5, Math.PI * 2.5);
        ctx.closePath();
        ctx.stroke();
      }
      else if (type === 'server') {
        const w = size * 0.6;
        const h = size * 0.16;
        const gap = size * 0.1;
        // 3 server racks
        ctx.rect(x - w/2, y - size * 0.3, w, h);
        ctx.rect(x - w/2, y - size * 0.3 + h + gap, w, h);
        ctx.rect(x - w/2, y - size * 0.3 + (h + gap) * 2, w, h);
        ctx.stroke();
      }
      else if (type === 'cog') {
        const ro = size * 0.28;
        const ri = size * 0.15;
        ctx.arc(x, y, ro, 0, Math.PI * 2);
        ctx.moveTo(x + ri, y);
        ctx.arc(x, y, ri, 0, Math.PI * 2);
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
          const cos = Math.cos(a);
          const sin = Math.sin(a);
          ctx.moveTo(x + ro * cos, y + ro * sin);
          ctx.lineTo(x + (ro + size * 0.08) * cos, y + (ro + size * 0.08) * sin);
        }
        ctx.stroke();
      }
    }

    class Particle {
      constructor(w, h) {
        this.reset(w, h, true);
      }

      reset(w, h, initial = false) {
        this.x = Math.random() * w;
        this.y = initial ? Math.random() * h : -20;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() * 0.35) + 0.15; // Slow drift down
        
        // Distribute types: 60% connection nodes, 25% tech text, 15% device/emoji icons
        const rand = Math.random();
        if (rand < 0.6) {
          this.type = 'dot';
          this.radius = Math.random() * 1.8 + 0.8;
          this.color = Math.random() > 0.5 ? '#367D8A' : '#285F6B'; // Amethyst or Rose
          this.alpha = Math.random() * 0.4 + 0.25; // Increased visibility
        } else if (rand < 0.85) {
          this.type = 'text';
          this.text = languages[Math.floor(Math.random() * languages.length)];
          this.fontSize = Math.floor(Math.random() * 4) + 11; // 11px to 15px
          this.color = Math.random() > 0.6 ? '#367D8A' : 'rgba(255, 255, 255, 0.8)';
          this.alpha = Math.random() * 0.15 + 0.15; // Increased visibility (from 0.02 - 0.10)
        } else {
          this.type = 'icon';
          this.iconType = iconTypes[Math.floor(Math.random() * iconTypes.length)];
          this.size = Math.floor(Math.random() * 6) + 16; // 16px to 22px
          this.alpha = Math.random() * 0.12 + 0.12; // Faint, subtle visibility
          this.rotation = Math.random() * Math.PI * 2;
          this.rotationSpeed = (Math.random() - 0.5) * 0.008; // Slow spin
        }
      }

      update(w, h) {
        // Gravitational pull to mouse cursor (stronger for dots)
        if (mouseX !== -9999) {
          const dx = mouseX - this.x;
          const dy = mouseY - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < cursorRadius) {
            const pullFactor = (cursorRadius - dist) / cursorRadius;
            const force = this.type === 'dot' ? 0.35 : 0.15;
            this.x += (dx / dist) * pullFactor * force;
            this.y += (dy / dist) * pullFactor * force;
          }
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.type === 'icon') {
          this.rotation += this.rotationSpeed;
        }

        // Recycle off borders
        if (this.y > h + 30 || this.x < -30 || this.x > w + 30) {
          this.reset(w, h, false);
        }
      }

      draw() {
        ctx.globalAlpha = this.alpha;

        if (this.type === 'dot') {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        } else if (this.type === 'text') {
          ctx.font = `500 ${this.fontSize}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = this.color;
          ctx.fillText(this.text, this.x, this.y);
        } else if (this.type === 'icon') {
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(this.rotation);
          drawVectorIcon(ctx, 0, 0, this.size, this.iconType);
          ctx.restore();
        }
      }
    }

    function initCanvas() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      bgCanvas.width = w;
      bgCanvas.height = h;

      const densityCount = w < 768 ? Math.floor(maxParticles * 0.45) : maxParticles;
      
      particles = [];
      for (let i = 0; i < densityCount; i++) {
        particles.push(new Particle(w, h));
      }
    }

    function drawWeb() {
      // Connect DOT type particles together
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        if (p1.type !== 'dot') continue;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          if (p2.type !== 'dot') continue;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectDistance) {
            const alpha = (1 - dist / connectDistance) * 0.28; // Increased connection line visibility
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            
            // Connect with subtle violet/rose lines
            ctx.strokeStyle = p1.color === '#367D8A' || p2.color === '#367D8A' ? 'rgba(54, 125, 138, 0.45)' : 'rgba(40, 95, 107, 0.35)';
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Draw connections to the cursor
        if (mouseX !== -9999) {
          const dxMouse = p1.x - mouseX;
          const dyMouse = p1.y - mouseY;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

          if (distMouse < cursorRadius) {
            const alphaMouse = (1 - distMouse / cursorRadius) * 0.45; // Increased cursor line visibility
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = 'rgba(54, 125, 138, 0.65)';
            ctx.globalAlpha = alphaMouse;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      if (!isTabActive) return;

      const w = bgCanvas.width;
      const h = bgCanvas.height;
      ctx.clearRect(0, 0, w, h);

      // Update and draw particles
      particles.forEach(p => {
        p.update(w, h);
        p.draw();
      });

      // Draw connection vectors
      drawWeb();

      animationFrameId = requestAnimationFrame(animate);
    }

    initCanvas();
    animate();

    window.addEventListener('resize', () => {
      initCanvas();
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        isTabActive = false;
        cancelAnimationFrame(animationFrameId);
      } else {
        isTabActive = true;
        animate();
      }
    });
  }


  // ── 3D PARALLAX CARD & PHOTO TILT EFFECT ──
  const tiltElements = document.querySelectorAll('.project-card, .hero-photo-card');
  tiltElements.forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      if (el.classList.contains('hero-photo-card')) {
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      } else {
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      }
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)`;
    });
  });


  // ── TYPEWRITER ROLE CYCLING ──
  const typewriterSpan = document.getElementById('typewriter');
  if (typewriterSpan) {
    const roles = [
      "Full-Stack Software Engineer",
      "AI Systems Integrator",
      "Real-Time App Developer",
      "B.Sc. CS Graduate (9.04 CGPA)"
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
      const currentRole = roles[roleIdx];

      if (isDeleting) {
        typewriterSpan.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
        typeSpeed = 50;
      } else {
        typewriterSpan.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
        typeSpeed = 150;
      }

      if (!isDeleting && charIdx === currentRole.length) {
        isDeleting = true;
        typeSpeed = 2200;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typeSpeed = 500;
      }

      setTimeout(type, typeSpeed);
    }
    setTimeout(type, 2300);
  }


  // ── DYNAMIC SECTION ACCENT SHADING THEMES (Tempest Stormy Teal Palette) ──
  const sectionThemes = {
    home: {
      accent: '#7fa6b3',
      accentDark: '#446370',
      accentRgb: '127, 166, 179',
      bg: '#060f17',
      glow: 'rgba(127, 166, 179, 0.06)'
    },
    projects: {
      accent: '#d8e2e6',
      accentDark: '#7fa6b3',
      accentRgb: '216, 226, 230',
      bg: '#0a1721',
      glow: 'rgba(216, 226, 230, 0.06)'
    },
    experience: {
      accent: '#7fa6b3',
      accentDark: '#446370',
      accentRgb: '127, 166, 179',
      bg: '#0e222e',
      glow: 'rgba(127, 166, 179, 0.06)'
    },
    praise: {
      accent: '#446370',
      accentDark: '#1d2f38',
      accentRgb: '68, 99, 112',
      bg: '#050c12',
      glow: 'rgba(68, 99, 112, 0.06)'
    },
    skills: {
      accent: '#d8e2e6',
      accentDark: '#7fa6b3',
      accentRgb: '216, 226, 230',
      bg: '#0a1721',
      glow: 'rgba(216, 226, 230, 0.06)'
    },
    links: {
      accent: '#7fa6b3',
      accentDark: '#446370',
      accentRgb: '127, 166, 179',
      bg: '#060f17',
      glow: 'rgba(127, 166, 179, 0.06)'
    }
  };

  function updateActiveTheme(sectionId) {
    const theme = sectionThemes[sectionId];
    if (theme) {
      const root = document.documentElement;
      root.style.setProperty('--theme-accent', theme.accent);
      root.style.setProperty('--theme-accent-dark', theme.accentDark);
      root.style.setProperty('--theme-accent-rgb', theme.accentRgb);
      root.style.setProperty('--theme-bg', theme.bg);
      root.style.setProperty('--theme-glow', theme.glow);
    }
  }

  // ── RIGHT-SIDE CIRCULAR DIAL COORDINATES LAYOUT ENGINE ──
  const sections = document.querySelectorAll('.scroll-section');
  const navItems = document.querySelectorAll('.nav-item');
  const wheelItems = document.querySelectorAll('.circular-wheel-item');
  const wheelTrack = document.querySelector('.circular-wheel-items');
  
  // Responsive radius — scale down for smaller screens
  function getWheelRadius() {
    if (window.innerWidth <= 1024) return 170;
    return 220;
  }
  let radius = getWheelRadius();
  const angleSpacing = 60; // 60 degrees to distribute 6 items around 360 degrees
  let currentWheelRotation = 180; // Start aligned to index 0 (180deg pointing left)

  // Initialize circular coordinates for dial menu items
  function layoutWheelItems() {
    radius = getWheelRadius();
    wheelItems.forEach((item, index) => {
      const angleDeg = -index * angleSpacing; // Negate to place downstream sections below Home
      const angleRad = (angleDeg * Math.PI) / 180;
      const x = radius * Math.cos(angleRad);
      const y = radius * Math.sin(angleRad);
      
      item.style.setProperty('--item-x', `${x}px`);
      item.style.setProperty('--item-y', `${y}px`);
      item.style.setProperty('--item-angle', `${angleDeg}deg`);
    });
  }
  layoutWheelItems();

  // Re-layout on resize for responsive radius
  window.addEventListener('resize', () => {
    layoutWheelItems();
  });

  function selectWheelItem(sectionId) {
    let activeIdx = 0;
    wheelItems.forEach((item, index) => {
      if (item.getAttribute('data-section') === sectionId) {
        item.classList.add('active');
        activeIdx = index;
      } else {
        item.classList.remove('active');
      }
    });

    if (wheelTrack) {
      // Rotate so active item aligns to 180° (pointing left into content)
      const targetAngle = 180 + activeIdx * angleSpacing;
      
      // Calculate shortest angular distance for rotation loop
      let diff = (targetAngle - currentWheelRotation) % 360;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      
      currentWheelRotation += diff;
      wheelTrack.style.setProperty('--wheel-rotation', `${currentWheelRotation}deg`);
    }
    updateActiveTheme(sectionId);
  }

  const navObserverOptions = {
    root: null,
    rootMargin: '-35% 0px -55% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Update active class on scroll sections
        sections.forEach(sec => sec.classList.remove('active'));
        entry.target.classList.add('active');
        
        // Update bottom mobile nav items if present
        navItems.forEach(item => {
          if (item.getAttribute('data-section') === id) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });

        // Update left circular navigation wheel rotation
        selectWheelItem(id);
      }
    });
  }, navObserverOptions);

  sections.forEach(sec => navObserver.observe(sec));


  // ── INTERSECTION OBSERVER FOR SCROLL REVEALS ──
  const revealElements = document.querySelectorAll('.fade-target, .fade-target-delayed');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  revealElements.forEach(el => revealObserver.observe(el));


  // ── NAVBAR SMOOTH CLICK SCROLLING ──
  const allScrollLinks = document.querySelectorAll('.nav-item, .circular-wheel-item');
  allScrollLinks.forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const sectionId = this.getAttribute('data-section') || (targetId ? targetId.replace('#', '') : null);
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        // Update scroll jacking index
        const sectionIdx = sectionsArray.indexOf(targetSection);
        if (sectionIdx !== -1) {
          isTransitioning = true;
          lastTransitionTime = Date.now();
          currentSectionIndex = sectionIdx;
          setTimeout(() => {
            isTransitioning = false;
            wheelDeltaSum = 0;
          }, 700);
        }

        // Immediately rotate wheel and update theme
        if (sectionId) {
          selectWheelItem(sectionId);
        }

        targetSection.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });


  // ── FORM SUBMISSION AJAX SUBMISSIONS ──
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('form-message');
  const submitBtn = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

  if (contactForm && formMessage && submitBtn) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending...';
      submitBtn.disabled = true;

      // Convert FormData to plain object for JSON submission
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      // Set up AbortController for a 4.5-second AJAX timeout fallback
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 4500);

      fetch(contactForm.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data),
        signal: controller.signal
      })
      .then(response => {
        clearTimeout(timeoutId);
        if (response.ok) {
          contactForm.reset();
          formMessage.style.display = 'block';
          formMessage.style.color = '#22c55e'; // Green text
          formMessage.textContent = 'Message submitted successfully!';
          
          playSynthSound('success');
          triggerHaptic(30);

          setTimeout(() => {
            formMessage.style.display = 'none';
          }, 5000);
          
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        } else {
          throw new Error('AJAX response not OK');
        }
      })
      .catch(error => {
        clearTimeout(timeoutId);
        console.warn("AJAX submit failed or timed out. Falling back to standard submit.", error);
        
        // Restore submit button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Redirect fallback: Submit natively to the standard FormSubmit endpoint
        contactForm.action = "https://formsubmit.co/r786chaurasiya@gmail.com";
        contactForm.submit();
      });
    });
  }


  // ── CHROMACUT & COLOR INVERSION FILTER FOR CUSTOM TYPOGRAPHIC PORTRAIT ──
  function keyOutImageBackground() {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = "profile.jpg?v=1.4";
    img.onload = () => {
      const keyCanvas = document.createElement('canvas');
      keyCanvas.width = img.width;
      keyCanvas.height = img.height;
      const ctx = keyCanvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      try {
        const imgData = ctx.getImageData(0, 0, keyCanvas.width, keyCanvas.height);
        const data = imgData.data;
        
        // Sample background key color at top-left pixel (0,0)
        const bgR = data[0];
        const bgG = data[1];
        const bgB = data[2];
        
        // Detect if background is light-colored (so we can invert the text to make it neon)
        const isLightBg = (bgR + bgG + bgB) / 3 > 120;
        
        // Distance threshold for background detection
        const threshold = 35; 
        
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];
          
          // Calculate color distance
          const dist = Math.sqrt(
            (r - bgR) * (r - bgR) +
            (g - bgG) * (g - bgG) +
            (b - bgB) * (b - bgB)
          );
          
          if (dist < threshold) {
            data[i+3] = 0; // Cut out background (make transparent)
          } else if (isLightBg) {
            // Text color inversion & mapping to glowing violet/rose neon gradient
            const brightness = 255 - ((r + g + b) / 3);
            
            const pixelIndex = i / 4;
            const y = Math.floor(pixelIndex / keyCanvas.width);
            const ratio = y / keyCanvas.height;
            
            // Map dark text to glowing violet-to-rose neon gradients
            data[i] = Math.floor(168 * (1 - ratio) + 244 * ratio); 
            data[i+1] = Math.floor(85 * (1 - ratio) + 63 * ratio);  
            data[i+2] = Math.floor(247 * (1 - ratio) + 182 * ratio); 
            data[i+3] = Math.floor(brightness * 1.35); // Boost contrast/alpha slightly
          }
        }
        
        ctx.putImageData(imgData, 0, 0);
        
        // Apply the transparent PNG cutout to the background image tag
        const bgImg = document.querySelector('#hologram-background img');
        if (bgImg) {
          bgImg.src = keyCanvas.toDataURL('image/png');
        }
      } catch (err) {
        // Tainted canvas fallback
      }
    };
  }

  // Remove white/light-gray background from typographic portrait so it floats on dark bg
  function removePortraitBackground() {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = 'portrait_bg.png?' + Date.now();
    img.onload = () => {
      const portraitCanvas = document.createElement('canvas');
      portraitCanvas.width  = img.width;
      portraitCanvas.height = img.height;
      const ctx = portraitCanvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      try {
        const imageData = ctx.getImageData(0, 0, portraitCanvas.width, portraitCanvas.height);
        const d = imageData.data;
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i], g = d[i+1], b = d[i+2];
          // Luminance — erase near-white / light-gray pixels
          const lum = (r + g + b) / 3;
          if (lum > 210 && Math.max(r,g,b) - Math.min(r,g,b) < 25) {
            // Smooth edge: fade out semi-whites
            const alpha = Math.max(0, 255 - ((lum - 210) * 8));
            d[i+3] = alpha;
          }
        }
        ctx.putImageData(imageData, 0, 0);
        const bgImg = document.querySelector('#hologram-background img');
        if (bgImg) {
          bgImg.src = portraitCanvas.toDataURL('image/png');
          // Fade in AFTER processing — prevents white flash
          requestAnimationFrame(() => {
            bgImg.style.opacity = '1';
          });
        }
      } catch(e) { /* tainted canvas fallback */ }
    };
  }

  // Run immediately — opacity:0→1 in CSS/JS already prevents the white flash
  removePortraitBackground();

  // ── GLOBAL SCROLL SNAPPING / PINNING FOR ALL SECTIONS ──
  const sectionsArray = Array.from(document.querySelectorAll('.scroll-section'));
  const projectsScrollContainer = document.querySelector('.projects-scroll-container');
  let currentSectionIndex = 0;
  let isTransitioning = false;
  let lastTransitionTime = 0;
  const snapCooldown = 1100; // 1.1s cooldown to absorb all trackpad inertia/momentum events
  
  // Track scroll direction & delta thresholds
  let wheelDeltaSum = 0;
  const wheelThreshold = 20; // minimum accumulative scroll delta to trigger a slide change

  // Touch swiping tracking variables
  let touchStartGlobalY = 0;
  let touchStartGlobalX = 0;

  // LERP Scroll variables for Projects
  let targetScrollTop = projectsScrollContainer ? projectsScrollContainer.scrollTop : 0;
  let currentScrollTop = projectsScrollContainer ? projectsScrollContainer.scrollTop : 0;
  let isLerping = false;

  // Buttery smooth linear interpolation loop
  function lerpScroll() {
    if (!projectsScrollContainer) return;
    const diff = targetScrollTop - currentScrollTop;
    if (Math.abs(diff) > 0.5) {
      currentScrollTop += diff * 0.15; // 0.15 speed provides a smooth organic slide
      projectsScrollContainer.scrollTop = currentScrollTop;
      requestAnimationFrame(lerpScroll);
    } else {
      projectsScrollContainer.scrollTop = targetScrollTop;
      currentScrollTop = targetScrollTop;
      isLerping = false;
    }
  }

  // Keep target scroll synced when the container is scrolled via links or layout adjustments
  if (projectsScrollContainer) {
    projectsScrollContainer.addEventListener('scroll', () => {
      if (!isLerping) {
        targetScrollTop = projectsScrollContainer.scrollTop;
        currentScrollTop = projectsScrollContainer.scrollTop;
      }
    }, { passive: true });
  }

  // Snapping transition helper (with infinite looping support)
  function transitionToSection(index) {
    if (index < 0) {
      index = sectionsArray.length - 1; // Wrap around to the last section
    } else if (index >= sectionsArray.length) {
      index = 0; // Wrap around to the first section
    }
    
    isTransitioning = true;
    lastTransitionTime = Date.now();
    currentSectionIndex = index;
    
    // Smooth scroll the viewport to the target section
    sectionsArray[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Unlock transitioning state after smooth scroll completes
    setTimeout(() => {
      isTransitioning = false;
      wheelDeltaSum = 0;
    }, 700);
  }

  // Update current section index based on viewport position (e.g. if the user clicks a nav link instead of scrolling)
  function updateSectionIndexFromScroll() {
    if (isTransitioning) return;
    const currentScrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    
    let activeIdx = 0;
    sectionsArray.forEach((sec, idx) => {
      const top = sec.offsetTop;
      const bottom = top + sec.offsetHeight;
      
      if (currentScrollY >= top - viewportHeight / 2 && currentScrollY < bottom - viewportHeight / 2) {
        activeIdx = idx;
      }
    });

    currentSectionIndex = activeIdx;
  }

  // Sync scroll index when smooth clicks or viewport resizes happen
  window.addEventListener('scroll', updateSectionIndexFromScroll, { passive: true });

  // Main scroll jacking logic
  window.addEventListener('wheel', (e) => {
    // Disable scroll jacking on mobile/tablet viewports
    if (window.innerWidth <= 768) {
      return;
    }

    // 1. Strict time cooldown lock to absorb all mouse/trackpad inertia events
    const timeSinceLast = Date.now() - lastTransitionTime;
    if (isTransitioning || timeSinceLast < snapCooldown) {
      e.preventDefault();
      return;
    }

    const currentSec = sectionsArray[currentSectionIndex];
    if (!currentSec) return;

    const sectionTop = currentSec.offsetTop;
    const sectionHeight = currentSec.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;

    const isAtSectionBottom = scrollY + viewportHeight >= sectionTop + sectionHeight - 15;
    const isAtSectionTop = scrollY <= sectionTop + 15;

    // Special logic for the projects container scrolling
    if (currentSec.id === 'projects' && projectsScrollContainer) {
      const maxScroll = projectsScrollContainer.scrollHeight - projectsScrollContainer.clientHeight;
      const actualScrollTop = projectsScrollContainer.scrollTop;
      const canScrollDown = e.deltaY > 0 && actualScrollTop < maxScroll - 5;
      const canScrollUp = e.deltaY < 0 && actualScrollTop > 5;

      if (canScrollDown || canScrollUp) {
        e.preventDefault();
        
        // Speed multipliers (moderate multiplier for trackpad delta inputs)
        const multiplier = Math.abs(e.deltaY) >= 100 ? 1.0 : 1.3;
        targetScrollTop += e.deltaY * multiplier;
        targetScrollTop = Math.max(0, Math.min(maxScroll, targetScrollTop));

        if (!isLerping) {
          isLerping = true;
          currentScrollTop = projectsScrollContainer.scrollTop;
          requestAnimationFrame(lerpScroll);
        }
        return;
      }
    }

    // Check if we should allow natural scrolling within the current section if it overflows the viewport
    if (sectionHeight > viewportHeight) {
      if (e.deltaY > 0 && !isAtSectionBottom) {
        // Let it scroll down naturally inside the section, do not prevent default
        return;
      }
      if (e.deltaY < 0 && !isAtSectionTop) {
        // Let it scroll up naturally inside the section, do not prevent default
        return;
      }
    }

    // Accumulate deltas to prevent over-sensitive triggers
    wheelDeltaSum += e.deltaY;

    if (Math.abs(wheelDeltaSum) >= wheelThreshold) {
      if (wheelDeltaSum > 0) {
        // Scroll down: next section (looping)
        e.preventDefault();
        transitionToSection(currentSectionIndex + 1);
      } else {
        // Scroll up: previous section (looping)
        e.preventDefault();
        transitionToSection(currentSectionIndex - 1);
      }
    } else {
      // Pin viewport scroll while delta accumulates
      e.preventDefault();
    }
  }, { passive: false });

  // Mobile touch swiping listeners
  window.addEventListener('touchstart', (e) => {
    touchStartGlobalY = e.touches[0].clientY;
    touchStartGlobalX = e.touches[0].clientX;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    // Disable scroll jacking on mobile/tablet viewports
    if (window.innerWidth <= 768) {
      return;
    }

    const timeSinceLast = Date.now() - lastTransitionTime;
    if (isTransitioning || timeSinceLast < snapCooldown) {
      e.preventDefault();
      return;
    }

    const touchY = e.touches[0].clientY;
    const deltaY = touchStartGlobalY - touchY; // positive = swipe up = scroll down
    const deltaX = touchStartGlobalX - e.touches[0].clientX;

    // Ignore horizontal swipes
    if (Math.abs(deltaX) > Math.abs(deltaY)) return;

    const currentSec = sectionsArray[currentSectionIndex];
    if (!currentSec) return;

    const sectionTop = currentSec.offsetTop;
    const sectionHeight = currentSec.offsetHeight;
    const viewportHeight = window.innerHeight;
    const scrollY = window.scrollY;

    const isAtSectionBottom = scrollY + viewportHeight >= sectionTop + sectionHeight - 15;
    const isAtSectionTop = scrollY <= sectionTop + 15;

    if (currentSec.id === 'projects' && projectsScrollContainer) {
      const maxScroll = projectsScrollContainer.scrollHeight - projectsScrollContainer.clientHeight;
      const actualScrollTop = projectsScrollContainer.scrollTop;
      const canScrollDown = deltaY > 0 && actualScrollTop < maxScroll - 5;
      const canScrollUp = deltaY < 0 && actualScrollTop > 5;

      if (canScrollDown || canScrollUp) {
        e.preventDefault();
        targetScrollTop += deltaY * 1.5;
        targetScrollTop = Math.max(0, Math.min(maxScroll, targetScrollTop));
        touchStartGlobalY = touchY; // update base coordinate

        if (!isLerping) {
          isLerping = true;
          currentScrollTop = projectsScrollContainer.scrollTop;
          requestAnimationFrame(lerpScroll);
        }
        return;
      }
    }

    // Check if we should allow natural scrolling within the current section if it overflows the viewport
    if (sectionHeight > viewportHeight) {
      if (deltaY > 0 && !isAtSectionBottom) {
        // Let it scroll down naturally inside the section, do not prevent default
        return;
      }
      if (deltaY < 0 && !isAtSectionTop) {
        // Let it scroll up naturally inside the section, do not prevent default
        return;
      }
    }

    // Minimum swipe distance threshold
    const swipeThreshold = 50;

    if (Math.abs(deltaY) >= swipeThreshold) {
      if (deltaY > 0) {
        // Swipe up = scroll down (looping)
        e.preventDefault();
        transitionToSection(currentSectionIndex + 1);
      } else {
        // Swipe down = scroll up (looping)
        e.preventDefault();
        transitionToSection(currentSectionIndex - 1);
      }
    } else {
      // Pin during active swipe
      e.preventDefault();
    }
  }, { passive: false });

  // Locked project modal logic
  const modal = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-project-title');
  const modalDesc = document.getElementById('modal-project-desc');
  const closeBtn = document.querySelector('.modal-close-btn');

  if (modal && closeBtn) {
    document.querySelectorAll('.locked-project').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const title = link.getAttribute('data-title');
        const desc = link.getAttribute('data-desc');
        
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
      });
    });

    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    });

    // Close on overlay click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Initialize loader flow: add loading state to body
  document.body.classList.add('loading');

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
  const interactiveTargets = document.querySelectorAll('a, button, .nav-item, .toc-item, .project-card, .praise-card, .social-link, .skill-tags span, .hero-photo-card');
  
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
    const devices = ['💻', '📱', '💾', '⚙️', '☁️', '⚡', '</>', '🚀', '🔑', '📊'];

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
      mouseX = -9999;
      mouseY = -9999;
    });

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
          this.color = Math.random() > 0.5 ? '#8B5CF6' : '#EC4899'; // Amethyst or Rose
          this.alpha = Math.random() * 0.4 + 0.15;
        } else if (rand < 0.85) {
          this.type = 'text';
          this.text = languages[Math.floor(Math.random() * languages.length)];
          this.fontSize = Math.floor(Math.random() * 4) + 10; // 10px to 14px
          this.color = Math.random() > 0.6 ? '#8B5CF6' : 'rgba(255, 255, 255, 0.8)';
          this.alpha = Math.random() * 0.08 + 0.02; // Very faint
        } else {
          this.type = 'device';
          this.text = devices[Math.floor(Math.random() * devices.length)];
          this.fontSize = Math.floor(Math.random() * 6) + 12; // 12px to 18px
          this.alpha = Math.random() * 0.12 + 0.03; // Subtle
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

        if (this.type === 'device') {
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
        } else if (this.type === 'device') {
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(this.rotation);
          ctx.font = `${this.fontSize}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(this.text, 0, 0);
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
            const alpha = (1 - dist / connectDistance) * 0.12;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            
            // Connect with subtle violet/rose lines
            ctx.strokeStyle = p1.color === '#8B5CF6' || p2.color === '#8B5CF6' ? 'rgba(139, 92, 246, 0.25)' : 'rgba(236, 72, 153, 0.15)';
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Draw connections to the cursor
        if (mouseX !== -9999) {
          const dxMouse = p1.x - mouseX;
          const dyMouse = p1.y - mouseY;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

          if (distMouse < cursorRadius) {
            const alphaMouse = (1 - distMouse / cursorRadius) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouseX, mouseY);
            ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)';
            ctx.globalAlpha = alphaMouse;
            ctx.lineWidth = 0.6;
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

    // Defer animation start until AFTER the loader exits to prevent lag
    // The loader removes itself at 2800ms, so we start the canvas then
    setTimeout(() => {
      animate();
    }, 2800);

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


  // ── INTERSECTION OBSERVER FOR ACTIVE BOTTOM & TOC DOT NAVIGATION ──
  const sections = document.querySelectorAll('.scroll-section');
  const navItems = document.querySelectorAll('.nav-item');
  const tocItems = document.querySelectorAll('.toc-item');

  const navObserverOptions = {
    root: null,
    rootMargin: '-35% 0px -55% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navItems.forEach(item => item.classList.remove('active'));
        tocItems.forEach(item => item.classList.remove('active'));

        const activeNav = document.querySelector(`.nav-item[data-section="${id}"]`);
        if (activeNav) {
          activeNav.classList.add('active');
        }

        const activeToc = document.querySelector(`.toc-item[data-section="${id}"]`);
        if (activeToc) {
          activeToc.classList.add('active');
        }
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
  const allScrollLinks = document.querySelectorAll('.nav-item, .toc-item');
  allScrollLinks.forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
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

  // Defer chromakey until after loader exits to prevent intro jank
  setTimeout(() => {
    removePortraitBackground();
  }, 2800);

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

  // Snapping transition helper
  function transitionToSection(index) {
    if (index < 0 || index >= sectionsArray.length) return;
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
        // Scroll down: next section
        if (currentSectionIndex < sectionsArray.length - 1) {
          e.preventDefault();
          transitionToSection(currentSectionIndex + 1);
        }
      } else {
        // Scroll up: previous section
        if (currentSectionIndex > 0) {
          e.preventDefault();
          transitionToSection(currentSectionIndex - 1);
        }
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
        if (currentSectionIndex < sectionsArray.length - 1) {
          e.preventDefault();
          transitionToSection(currentSectionIndex + 1);
        }
      } else {
        if (currentSectionIndex > 0) {
          e.preventDefault();
          transitionToSection(currentSectionIndex - 1);
        }
      }
    } else {
      // Pin during active swipe
      e.preventDefault();
    }
  }, { passive: false });
});

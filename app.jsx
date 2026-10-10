import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);
import ToolsSection from './src/components/ToolsSection';
import greetingAudio from './assets/greeting.mp3';
import AIAssistant from './src/components/AIAssistant';
import ProjectModal from './src/components/ProjectModal';

// ── SCROLL REVEAL HOOK ────────────────────────────
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

// ── TYPING HOOK ───────────────────────────────────
function useTyping(phrases) {
  const [text, setText] = useState('');
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const phrase = phrases[idx];
    let timer;
    if (!deleting) {
      if (text.length < phrase.length) {
        timer = setTimeout(() => setText(phrase.slice(0, text.length + 1)), 80);
      } else {
        timer = setTimeout(() => setDeleting(true), 2000);
      }
    } else {
      if (text.length > 0) {
        timer = setTimeout(() => setText(phrase.slice(0, text.length - 1)), 40);
      } else {
        setDeleting(false);
        setIdx(p => (p + 1) % phrases.length);
      }
    }
    return () => clearTimeout(timer);
  }, [text, deleting, idx, phrases]);
  return text;
}

// ═══════════════════════════════════════════════
// ═══════════════════════════════════════════════
// HERO CANVAS (DYNAMIC CONSTELLATION & AURORA MESH)
// ═══════════════════════════════════════════════
function HeroCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = canvas.offsetWidth;
    let h = canvas.height = canvas.offsetHeight;
    
    let mouse = { x: -1000, y: -1000 };

    const colors = ['rgba(163,42,57,0.45)', 'rgba(220,53,69,0.35)', 'rgba(255,215,0,0.45)', 'rgba(255,101,120,0.35)'];

    const dots = Array.from({ length: 75 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2.2 + 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      pulseSpeed: Math.random() * 0.04 + 0.01,
      angle: Math.random() * Math.PI * 2
    }));

    let time = 0;
    let raf;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      time += 0.015;

      dots.forEach(d => {
        d.angle += d.pulseSpeed;
        d.x += d.vx;
        d.y += d.vy + Math.sin(time + d.x * 0.005) * 0.25;

        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;

        // Interactive mouse attraction
        const mDist = Math.hypot(d.x - mouse.x, d.y - mouse.y);
        if (mDist < 130) {
          const angle = Math.atan2(d.y - mouse.y, d.x - mouse.x);
          const force = (130 - mDist) / 130;
          d.x += Math.cos(angle) * force * 1.5;
          d.y += Math.sin(angle) * force * 1.5;
        }

        const radius = d.r + Math.sin(d.angle) * 0.6;
        ctx.beginPath();
        ctx.arc(d.x, d.y, Math.max(0.5, radius), 0, Math.PI * 2);
        ctx.fillStyle = d.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = d.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Connections between dots
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i];
          const b = dots[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 115) {
            const alpha = 0.12 * (1 - dist / 115);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(220,53,69,${alpha})`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    }
    draw();

    const onMouse = e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const onResize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('mousemove', onMouse); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={canvasRef} id="hero-canvas" aria-hidden="true" />;
}

// ═══════════════════════════════════════════════
// INTRO BACKGROUND CANVAS (DYNAMIC AURORA SPARKS & NEON WAVES)
// ═══════════════════════════════════════════════
function IntroCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const colors = ['#dc3545', '#ffd700', '#ff5564', '#a32a39'];

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vy: -(Math.random() * 0.9 + 0.4),
      vx: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2.5 + 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.6 + 0.3,
      pulse: Math.random() * Math.PI
    }));

    let time = 0;
    let raf;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      time += 0.02;

      particles.forEach(p => {
        p.y += p.vy;
        p.x += p.vx + Math.sin(time + p.y * 0.01) * 0.4;
        p.pulse += 0.03;

        if (p.y < -15) {
          p.y = h + 15;
          p.x = Math.random() * w;
        }

        const currentRadius = p.r + Math.sin(p.pulse) * 0.5;

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.6, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 14;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
      });

      raf = requestAnimationFrame(draw);
    }
    draw();

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);

  return <canvas ref={canvasRef} id="intro-bg-canvas" aria-hidden="true" />;
}

// ═══════════════════════════════════════════════
// CERT MODAL
// ═══════════════════════════════════════════════
function CertModal({ cert, onClose }) {
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  return (
    <div className="cert-modal active" aria-modal="true" role="dialog">
      <div className="cert-modal-overlay" onClick={onClose} />
      <div className="cert-modal-content anim-scale-in">
        <button className="cert-modal-close" onClick={onClose} aria-label="Close">×</button>
        <div className="cert-modal-grid">
          <div className="cert-modal-img-col">
            <img src={cert.img} alt={cert.title} />
          </div>
          <div className="cert-modal-info-col">
            <span className={`cert-badge ${cert.badgeColor}`}>{cert.badge}</span>
            <h2>{cert.title}</h2>
            <div className="ci-org">{cert.org}</div>
            <div className="ci-meta">{cert.meta}</div>
            <p className="ci-desc">{cert.desc}</p>
            <div className="cert-modal-actions">
              <a href={cert.img} target="_blank" rel="noopener noreferrer" className="btn-primary">OPEN FULL RESOLUTION →</a>
              {cert.pdf && <a href={cert.pdf} download className="btn-outline">DOWNLOAD DOCUMENT ↓</a>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [cursorHover, setCursorHover] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [certFilter, setCertFilter] = useState('all');
  const [selectedCert, setSelectedCert] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // ── INTRO SPLASH STATE ─────────────────────────
  const [introVisible, setIntroVisible]   = useState(true);  // show overlay
  const [brandClicks, setBrandClicks] = useState(0);
  const [toastMessage, setToastMessage] = useState('');
  const [introFading, setIntroFading]     = useState(false);  // trigger CSS fade-out
  const [loadingProgress, setLoadingProgress] = useState(0);
  const hasPlayedInitialVoiceRef = useRef(false);
  const audioGreetingRef = useRef(null);
  const heroTlRef = useRef(null);
  const [isSpeakingActive, setIsSpeakingActive] = useState(false);

  // Loading Counter Animation
  useEffect(() => {
    if (!introVisible) return;
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 5) + 1; // Random increments
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setLoadingProgress(progress);
    }, 40);
    return () => clearInterval(interval);
  }, [introVisible]);

  // Lock body scroll while Intro Splash is active
  useEffect(() => {
    if (introVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (typeof window !== 'undefined' && ScrollTrigger) {
        ScrollTrigger.refresh();
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [introVisible]);

  // ── DISMISS INTRO: fade out, unlock scroll & trigger hero entrance ───────
  const dismissIntro = useCallback(() => {
    if (audioGreetingRef.current) {
      audioGreetingRef.current.pause();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIntroFading(true);
    if (heroTlRef.current) {
      heroTlRef.current.play();
    }
    setTimeout(() => {
      setIntroVisible(false);
      document.body.style.overflow = '';
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (typeof window !== 'undefined' && ScrollTrigger) {
        ScrollTrigger.refresh();
      }
    }, 850);
  }, []);

  // ── AUDIO INIT ─────────────────────────────────
  useEffect(() => {
    const audio = new Audio(greetingAudio);
    audio.preload = 'auto';
    audio.volume = 1.0;
    audioGreetingRef.current = audio;

    audio.onplay = () => {
      hasPlayedInitialVoiceRef.current = true;
      setIsSpeakingActive(true);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };

    audio.onended = () => {
      setIsSpeakingActive(false);
      setTimeout(() => {
        dismissIntro();
      }, 400);
    };

    audio.onerror = (e) => {
      console.warn("Audio load error:", e);
      setIsSpeakingActive(false);
    };

    audio.onpause = () => {
      setIsSpeakingActive(false);
    };

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [dismissIntro]);

  // ── PLAY GREETING (STRICT SINGLE VOICE PLAYBACK) ────────
  const playGreeting = useCallback(() => {
    if (hasPlayedInitialVoiceRef.current) return;
    const audio = audioGreetingRef.current;
    if (!audio) return;

    if (audio.paused || audio.ended) {
      audio.currentTime = 0;
      audio.play().then(() => {
        hasPlayedInitialVoiceRef.current = true;
        setIsSpeakingActive(true);
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      }).catch((err) => {
        console.warn("Autoplay awaiting user interaction:", err);
        // Fallback: Web Speech API Indian female voice ONCE
        if ('speechSynthesis' in window && !hasPlayedInitialVoiceRef.current) {
          window.speechSynthesis.cancel();
          hasPlayedInitialVoiceRef.current = true;

          const speak = (voices) => {
            const text = "Hello! I'm Praseetha, and welcome to my portfolio. Let's explore my portfolio together!";
            const utter = new SpeechSynthesisUtterance(text);
            utter.rate   = 1.10;
            utter.pitch  = 1.25;
            utter.volume = 1.0;

            const indianFemaleVoice =
              voices.find(v => (v.lang === 'ta-IN' || v.lang === 'ta_IN') && /female|pallavi|rani/i.test(v.name)) ||
              voices.find(v => (v.lang === 'en-IN' || v.lang === 'en_IN') && /female|neerja|heera|veena|kavya/i.test(v.name)) ||
              voices.find(v => v.lang.startsWith('en-IN') || v.lang.startsWith('en_IN') || v.lang.startsWith('ta-IN')) ||
              voices.find(v => /indian|tamil/i.test(v.name)) ||
              voices.find(v => v.name === 'Google UK English Female') ||
              voices.find(v => v.name === 'Samantha') ||
              voices.find(v => /female/i.test(v.name) && v.lang.startsWith('en')) ||
              voices.find(v => v.lang.startsWith('en-'));

            if (indianFemaleVoice) utter.voice = indianFemaleVoice;

            utter.onstart = () => {
              setIsSpeakingActive(true);
            };
            utter.onend = () => {
              setIsSpeakingActive(false);
              setTimeout(dismissIntro, 400);
            };
            utter.onerror = () => {
              setIsSpeakingActive(false);
            };
            window.speechSynthesis.speak(utter);
          };

          const voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) speak(voices);
          else {
            window.speechSynthesis.onvoiceschanged = () => {
              speak(window.speechSynthesis.getVoices());
              window.speechSynthesis.onvoiceschanged = null;
            };
          }
        }
      });
    }
  }, [dismissIntro]);

  // Auto-play on load & auto-trigger on user tap
  useEffect(() => {
    playGreeting();

    const autoPlaySignal = () => {
      if (!hasPlayedInitialVoiceRef.current) {
        playGreeting();
      }
    };

    window.addEventListener('click',       autoPlaySignal, { passive: true });
    window.addEventListener('touchstart',  autoPlaySignal, { passive: true });
    window.addEventListener('pointerdown', autoPlaySignal, { passive: true });

    return () => {
      window.removeEventListener('click',       autoPlaySignal);
      window.removeEventListener('touchstart',  autoPlaySignal);
      window.removeEventListener('pointerdown', autoPlaySignal);
    };
  }, [playGreeting]);

  const typingText = useTyping(['front-end development', 'UI/UX design', 'AI & Machine Learning', 'digital experiences']);

  // Easter egg: brand click counter
  const handleBrandClick = (e) => {
    setBrandClicks(c => {
      const newCount = c + 1;
      if (newCount >= 5) {
        setToastMessage('You found something 👀 — Welcome, curious one!');
        return 0;
      }
      return newCount;
    });
    // Auto reset after 1s
    clearTimeout(window.brandTimer);
    window.brandTimer = setTimeout(() => setBrandClicks(0), 1000);
  };

  // Copy email feedback
  const copyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText('praseethasathish28@gmail.com').then(() => {
      setToastMessage('Email copied to clipboard 📋');
    }).catch(() => {
      setToastMessage('Failed to copy email');
    });
  };

  // Card Tilt Handler — Keep picture perfectly straight and upright
  const handleTiltMove = (e) => {
    const card = e.currentTarget;
    if (card) card.style.transform = 'none';
  };

  const handleTiltLeave = (e) => {
    const card = e.currentTarget;
    if (card) card.style.transform = 'none';
    setCursorHover(false);
  };

  useGSAP(() => {
    const isMobile = window.innerWidth <= 768;

    // 1. Header reveal on load
    gsap.from('#site-header', {
      y: -40,
      opacity: 0,
      duration: 1.1,
      ease: 'power4.out'
    });

    // 2. Hero Elements Entrance Stagger Animation
    const heroTl = gsap.timeline({ paused: introVisible });
    heroTl
      .from('.hero-meta-stamp', { y: -25, opacity: 0, duration: 0.7, ease: 'power3.out' })
      .from('.hero-headline', { y: 40, opacity: 0, duration: 1.0, ease: 'power4.out' }, '-=0.45')
      .from('.hero-intro', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.55')
      .from('.hero-btns > *', { y: 25, opacity: 0, stagger: 0.14, duration: 0.7, ease: 'power3.out' }, '-=0.45')
      .from('.hero-tags span', { scale: 0.85, opacity: 0, stagger: 0.07, duration: 0.55, ease: 'back.out(1.7)' }, '-=0.35');

    heroTlRef.current = heroTl;
    if (!introVisible) {
      heroTl.play();
    }

    // 3. Hero Scroll Scrub
    if (!isMobile) {
      gsap.timeline({
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5
        }
      })
      .to('.hero-copy', { y: -60, opacity: 0.2 }, 0);
    }

    // 3. Section Titles & Numbers
    gsap.utils.toArray('.sec-title, .sec-num').forEach(el => {
      gsap.fromTo(el, 
        { y: 38, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // 4. About Copy
    gsap.from('.about-copy p', {
      y: 35,
      opacity: 0,
      stagger: 0.15,
      duration: 0.85,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.about-section',
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });

    // 5. What I Do (WID) Cards
    gsap.from('.wid-col', {
      y: 50,
      opacity: 0,
      scale: 0.95,
      stagger: 0.14,
      duration: 0.85,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: '.wid-cols',
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });

    // 6. Experience Card
    gsap.from('.exp-card', {
      y: 45,
      opacity: 0,
      duration: 0.85,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: '.exp-section',
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });

    // 7. Featured Projects Grid Cards
    gsap.utils.toArray('.projects-section .featured-grid').forEach(grid => {
      gsap.from(grid.children, {
        y: 50,
        opacity: 0,
        scale: 0.94,
        stagger: 0.14,
        duration: 0.85,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: grid,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    });

    // 8. AI Projects Rows
    gsap.from('.proj-row', {
      x: isMobile ? 0 : -45,
      y: isMobile ? 35 : 0,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.proj-list',
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });

    // 9. Personal Strengths Row
    gsap.from('.strengths-row > *', {
      scale: 0.8,
      opacity: 0,
      stagger: 0.08,
      duration: 0.65,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: '.strengths-section',
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });

    // 10. Certifications Grid
    gsap.from('.cert-card', {
      y: 45,
      scale: 0.94,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: '.cert-grid',
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });

    // 11. Education Timeline Rows
    gsap.from('.edu-row', {
      x: isMobile ? 0 : -40,
      y: isMobile ? 30 : 0,
      opacity: 0,
      stagger: 0.14,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.edu-compact-timeline',
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });

    // 12. Highlights List
    gsap.from('.hl-item', {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.hl-compact-list',
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });

    // 13. Beyond Classroom Items
    gsap.from('.beyond-list li', {
      x: isMobile ? 0 : -25,
      y: isMobile ? 25 : 0,
      opacity: 0,
      stagger: 0.08,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.beyond-list',
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });

    // 14. Off The Screen Cards
    gsap.from('.os-card-min', {
      y: 40,
      opacity: 0,
      rotation: isMobile ? 0 : 1.5,
      stagger: 0.1,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.offscreen-grid',
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });

    // 15. Stripe Columns
    gsap.from('.stripe-col', {
      y: 30,
      opacity: 0,
      stagger: 0.12,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.stripe-grid',
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });

    // 16. Contact Method Cards
    gsap.from('.contact-method-card', {
      y: 40,
      opacity: 0,
      stagger: 0.1,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.contact-methods-grid',
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });

    // 17. Thirukkural Section
    gsap.from('.tk-card-wrapper', {
      scale: 0.92,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.tk-section',
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });

    // 18. Footer Blocks
    gsap.from('.footer-pro-top > *', {
      y: 30,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '#site-footer',
        start: 'top 92%',
        toggleActions: 'play none none none'
      }
    });

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
  }, { scope: '#root' });

  // Scroll & cursor & section spy
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(docH > 0 ? (window.scrollY / docH) * 100 : 0);

      const sectionIds = ['hero', 'about', 'what-i-do', 'experience', 'projects', 'certifications', 'skills', 'education', 'connect'];
      const scrollPos = window.scrollY + 220;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    const onMouse = e => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('mousemove', onMouse); };
  }, []);

  // ── CERTS DATA ─────────────────────────────────
  const certs = [
    { id: 'c1', cat: 'awards', img: 'certificates/CERTIFICATE1.jpeg', badge: 'PROJECT EXPO WINNER', badgeColor: 'gold', title: 'Project Expo 2K25 — Credit Card Fraud Detection', org: 'VCET · DEPT OF AI & DS', meta: '07.03.2025 · Exhibitor & ML Project Winner', desc: 'Exhibited machine learning classification framework for credit card fraud detection in imbalanced financial datasets.' },
    { id: 'c2', cat: 'tech', img: 'certificates/CERTIFICATE2.jpeg', badge: 'UI/UX SPECIALIST', badgeColor: 'purple', title: 'Figma Bootcamp: Learn UI/UX Design', org: 'KONGU ENGINEERING COLLEGE', meta: '27.03.2026 · Hands-on Certification', desc: 'Covered UI/UX principles, auto-layouts, interactive components, prototyping and design systems.' },
    { id: 'c3', cat: 'awards', img: 'certificates/CERTIFICATE5.jpeg', badge: 'NATIONAL LEVEL WINNER', badgeColor: 'cyan', title: "Celesta '25 Techno Fest — Winner / Paper League", org: 'BANNARI AMMAN INST OF TECH', meta: '10.10.2025 · Code Circle Club', desc: 'Secured top honors in Workshop & Paper League presenting AI applications in modern automation.' },
    { id: 'c4', cat: 'awards', img: 'certificates/CERTIFICATE7.jpeg', badge: 'NATIONAL INNOVATION PITCH', badgeColor: 'purple', title: "IdeaFest '25 — AI Missing Person ID System", org: 'VCET · DEPT OF AI & DS', meta: '20.11.2025 · Silver Jubilee Pitch', desc: 'Presented AI System for Identifying Missing Persons and Unidentified Bodies using facial recognition embeddings.' },
    { id: 'c5', cat: 'awards', img: 'certificates/CERTIFIATE4.jpeg', badge: '1ST PRIZE WINNER 🏆', badgeColor: 'gold', title: '1st Prize — Creative Poster Making', org: 'ENGLISH LITERARY ASSOCIATION', meta: '2024-2025 · VCET ELA', desc: 'Secured FIRST prize in Creative Poster Making Competition with standout visual & concept.' },
    { id: 'c7', cat: 'tech', img: 'certificates/CERTIFICATE3.jpeg', badge: 'DEPT LEADERSHIP', badgeColor: 'cyan', title: 'Magazine Committee Certificate of Appreciation', org: 'VCET · DEPT OF AI & DS', meta: '2024-2025 · ASPYRA Association', desc: 'Appreciation certificate for active editorial contribution and symposium magazine publication.' },
    { id: 'c8', cat: 'tech', img: 'certificates/GuviCertification .png', badge: 'VERIFIED TECH CREDENTIAL', badgeColor: 'green', title: 'GUVI Tech Certification', org: 'GUVI GEEK NETWORK · IIT MADRAS PARK', meta: '2024 · Web Technologies', desc: 'Certified in web development and software engineering fundamentals via GUVI IIT Madras platform.' },
    { id: 'c9', cat: 'nptel', img: 'certificates/cert_hci_nptel.jpg', badge: 'ELITE CERTIFICATE · 75%', badgeColor: 'gold', title: 'Human Computer Interaction', org: 'NPTEL · IIT ONLINE CERTIFICATION', meta: '2026 · Elite Silver Medal (75%)', desc: 'NPTEL certification covering user experience ergonomics, interaction design & cognitive frameworks.', pdf: 'assets/nptel.pdf' },
    { id: 'c10', cat: 'nptel', img: 'certificates/cert_privacy_security.jpg', badge: 'NPTEL CERTIFIED · 51%', badgeColor: 'blue', title: 'Privacy & Security in Online Social Media', org: 'NPTEL · IIT ONLINE CERTIFICATION', meta: '2025 · Online Certification', desc: 'Studied social network security, privacy metrics, OSINT threats & online data safety protocols.' },
    { id: 'c11', cat: 'nptel', img: 'certificates/cert_soft_skills.jpg', badge: 'NPTEL CERTIFIED · 60%', badgeColor: 'blue', title: 'Enhancing Soft Skills & Personality', org: 'NPTEL · IIT ONLINE CERTIFICATION', meta: '2025 · Online Certification', desc: 'Professional skills development focusing on leadership, communication, team collaboration & ethics.' },
  ];

  const filteredCerts = certFilter === 'all' ? certs : certs.filter(c => c.cat === certFilter);

  // ── FEATURED PROJECTS DATA ─────────────────────
  const featuredProjects = [
    { img: 'assets/sathya_group_thumb.jpg', alt: 'Sathya Group', cat: 'Client Project • Corporate Website • UI/UX', title: 'Sathya Group', desc: 'A responsive corporate website designed for Sathya Group, bringing multiple business verticals into one structured digital experience.', tech: ['HTML', 'CSS', 'JavaScript', 'Figma'], live: 'https://ornate-daffodil-e96abf.netlify.app/' },
    { img: 'assets/henna_laksh_thumb.jpg', alt: 'Henna by Laksh', cat: 'Client Project • Business Website', title: 'Henna by Laksh', desc: 'A premium responsive business website for a henna artist — visual storytelling, gallery, appointment booking and contact functionality.', tech: ['HTML', 'CSS', 'JavaScript'], live: 'https://henna-by-laksh.netlify.app/', github: 'https://github.com/Praseetha-S/henna__by_laksh' },
    { img: 'assets/aari.jpg', alt: 'SD Aari Works', cat: 'Client Project • Business Website', title: 'SD Aari Works', desc: 'A responsive business website for SD Aari Works, presenting its services through a clean, visually focused interface.', tech: ['HTML', 'CSS', 'JavaScript'], live: 'https://sd-aari.netlify.app/' },
    { img: 'assets/bakery.jpg', alt: 'Bake Theory', cat: 'Web Development • UI Design', title: 'Bake Theory', desc: 'A responsive bakery website designed to showcase products, categories, offers and brand information through an attractive interface.', tech: ['HTML', 'CSS', 'JavaScript'], live: 'https://baketheorypraseetha.netlify.app/', github: 'https://github.com/Praseetha-S/bakery-website', pages: 'https://praseethasathish28-ux.github.io/bakery-website/' },
    { img: 'assets/boutique.jpg', alt: 'Timeless Elegant Boutique', cat: 'Web Development • Fashion Website', title: 'Timeless Elegant Boutique', desc: 'An elegant responsive boutique website showcasing fashion collections through a clean visual interface and organized categories.', tech: ['HTML', 'CSS', 'JavaScript'], live: 'https://boutique-timeless-elegant.netlify.app/', github: 'https://github.com/Praseetha-S/boutique-website' },
    { img: 'assets/hospital.jpg', alt: 'Sri Krishna Hospital', cat: 'Web Development • Healthcare Website', title: 'Sri Krishna Hospital', desc: 'A professional healthcare website presenting hospital information and services through a clean, accessible and trustworthy digital interface.', tech: ['HTML', 'CSS', 'JavaScript'], live: 'https://sri-krishnahospital.netlify.app/' },
    { img: 'assets/gym134_thumb.jpg', alt: 'Gym134', cat: 'Web Development • Fitness Website', title: 'Gym134', desc: 'A modern fitness website with bold visual style to present gym services, training information and fitness-focused content.', tech: ['HTML', 'CSS', 'JavaScript'], live: 'https://gym134.netlify.app/' },
  ];

  const uiuxProjects = [
    { img: 'assets/poster_showcase_thumb.png', alt: 'Poster Showcase', cat: 'UI/UX Design', title: 'Poster Showcase', desc: 'A creative poster showcase interface to present a collection of poster designs with visual storytelling and interactive browsing.', tech: ['Figma', 'UI/UX Design', 'Visual Design'], live: 'https://www.figma.com/proto/m1bBYwKPYc626pPFyGCy7d/POSTER-SHOWCASE?node-id=1-2&p=f&viewport=195%2C29%2C0.33&t=pS4hENxt8EaNk6Gj-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=1%3A2&page-id=0%3A1', liveLabel: '🎨 View Project ↗' },
    { img: 'assets/foodzy_app_thumb.png', alt: 'Foodzy App', cat: 'UI/UX Design', title: 'Foodzy App', desc: 'A food delivery app UI/UX exploration focused on a clean, visually balanced interface with menu browsing and user experience.', tech: ['Figma', 'UI/UX Design'], live: 'https://www.figma.com/proto/EiprjxyejN5pUv7SVJ3r2s/Untitled?node-id=35-31&p=f&viewport=-15073%2C-4466%2C0.79&t=XMShaMyPB5CMxjC5-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=35%3A31&page-id=0%3A1', liveLabel: '🎨 View Design ↗' },
    { img: 'assets/movie_booking_thumb.png', alt: 'Movie Booking App', cat: 'UI/UX Design', title: 'Movie Booking App', desc: 'An interactive movie ticket booking prototype exploring interface structure, seat selection flow, and visual interaction.', tech: ['Figma', 'UI/UX Prototype'], live: 'https://www.figma.com/proto/s90zUKIWhm5NMXR7aLjtjp/Untitled?node-id=17-5&p=f&viewport=-140%2C240%2C0.32&t=lX3z3UgEV2iRFnUN-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=17%3A5&page-id=0%3A1', liveLabel: '🎨 View Prototype ↗' },
  ];

  return (
    <>
      {/* ══ PREMIUM LOADING SPLASH ══════════════════ */}
      {introVisible && (
        <div 
          className={`intro-splash premium-loader ${introFading ? 'fading' : ''}`} 
          aria-live="polite"
        >
          {/* Dynamic Background Noise/Texture */}
          <div className="loader-noise" />

          {/* Huge centered loading counter */}
          <div className="loader-content">
            <div className="loader-counter">
              {loadingProgress}
              <span className="loader-percent">%</span>
            </div>
            
            <div className="loader-progress-bar">
              <div className="loader-progress-fill" style={{ width: `${loadingProgress}%` }} />
            </div>

            <div className="loader-footer">
              <span className="loader-status">
                {loadingProgress < 100 ? 'Initializing digital experience...' : 'Ready.'}
              </span>
              
              <button 
                className={`loader-enter-btn ${loadingProgress === 100 ? 'ready' : ''}`}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (loadingProgress === 100) {
                    playGreeting();
                    dismissIntro(); 
                  }
                }}
                disabled={loadingProgress < 100}
              >
                Enter Portfolio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCROLL PROGRESS */}
      <div id="scroll-progress" style={{ width: `${scrollPct}%` }} aria-hidden="true" />

      {/* CURSOR */}
      <div className="cursor-dot" style={{ left: cursorPos.x, top: cursorPos.y }} aria-hidden="true" />
      <div className={`cursor-follower ${cursorHover ? 'hovering' : ''}`} style={{ left: cursorPos.x, top: cursorPos.y }} aria-hidden="true" />

      {/* ══ ADVANCED HEADER ════════════════════════ */}
      <header id="site-header" className={scrolled ? 'scrolled' : ''}>
        <div className="header-inner">
          <a href="#hero" className="brand" onClick={handleBrandClick}>
            <span className="brand-dot" />
            <span className="brand-text">PRASEETHA S</span>
          </a>
          <nav className={`header-nav ${mobileOpen ? 'open' : ''}`} id="header-nav">
            <a href="#about" className={activeSection === 'about' ? 'active' : ''} onClick={() => setMobileOpen(false)}><span className="nav-num">01.</span> ABOUT</a>
            <a href="#experience" className={activeSection === 'experience' ? 'active' : ''} onClick={() => setMobileOpen(false)}><span className="nav-num">02.</span> WORK</a>
            <a href="#projects" className={activeSection === 'projects' ? 'active' : ''} onClick={() => setMobileOpen(false)}><span className="nav-num">03.</span> PROJECTS</a>
            <a href="#certifications" className={activeSection === 'certifications' ? 'active' : ''} onClick={() => setMobileOpen(false)}><span className="nav-num">04.</span> CERTIFICATES</a>
            <a href="#skills" className={activeSection === 'skills' ? 'active' : ''} onClick={() => setMobileOpen(false)}><span className="nav-num">05.</span> SKILLS</a>
            <a href="#education" className={activeSection === 'education' ? 'active' : ''} onClick={() => setMobileOpen(false)}><span className="nav-num">06.</span> JOURNEY</a>
            <a href="#connect" className={activeSection === 'connect' ? 'active' : ''} onClick={() => setMobileOpen(false)}><span className="nav-num">07.</span> CONTACT</a>
          </nav>
          <div className="header-actions">
            <a href="PRASEETHA_S_RESUME.pdf" target="_blank" rel="noopener noreferrer" className="btn-resume-header">
              RESUME <i className="fa-solid fa-arrow-down-to-line" />
            </a>
            <a href="#connect" className="btn-talk">
              LET'S TALK <i className="fa-solid fa-paper-plane" />
            </a>
            <button className={`mobile-toggle ${mobileOpen ? 'is-active' : ''}`} onClick={() => setMobileOpen(p => !p)} aria-label="Menu">
              <span className="bar line-1" />
              <span className="bar line-2" />
              <span className="bar line-3" />
            </button>
          </div>
        </div>
      </header>

      {/* ══ HERO ════════════════════════════════════ */}
      <section id="hero" className="hero">
        <HeroCanvas />
        <div className="container">
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="hero-meta-stamp">AI & DS / FRONT-END / UI & UX</span>
              <h1 className="hero-headline">
                BUILDING WITH<br />
                CODE, DESIGN<br />
                & CURIOSITY.
              </h1>
              <p className="hero-intro">
                I'm Praseetha S — an AI & Data Science student exploring{' '}
                <span style={{ color: 'var(--orange)' }}>{typingText}</span>
                <span className="typing-cursor">|</span>
              </p>
              <div className="hero-btns">
                <a href="#projects" className="btn-primary" onMouseEnter={() => setCursorHover(true)} onMouseLeave={() => setCursorHover(false)}>EXPLORE WORK ↓</a>
                <a href="PRASEETHA_S_RESUME.pdf" target="_blank" rel="noopener noreferrer" className="btn-outline" onMouseEnter={() => setCursorHover(true)} onMouseLeave={() => setCursorHover(false)}>VIEW RESUME →</a>
              </div>
              <div className="hero-tags">
                <span>FRONT-END</span>
                <span>UI / UX</span>
                <span>AI / ML</span>
                <span>AIoT</span>
              </div>
            </div>
            <div className="portrait-wrap">
              <div className={`portrait-frame ${isSpeakingActive ? 'video-active' : ''}`}
                onMouseMove={(e) => {
                  handleTiltMove(e);
                }}
                onMouseLeave={handleTiltLeave}
                onMouseEnter={() => setCursorHover(true)}>

                {/* AMBIENT GLOW BEHIND IMAGE */}
                {isSpeakingActive && <div className="portrait-aura" />}

                {/* PORTRAIT IMAGE BOX WITH TALKING MOUTH */}
                <div className={`portrait-img-box ${isSpeakingActive ? 'video-playing' : ''}`}>
                  <img
                    src="profile.jpeg"
                    alt="Praseetha S"
                    className={`portrait-img ${isSpeakingActive ? 'video-active-img talking-pulse' : ''}`}
                  />



                  {/* SOUND WAVE RINGS */}
                  {isSpeakingActive && (
                    <div className="voice-waves-overlay">
                      <span className="vw-ring r1" />
                      <span className="vw-ring r2" />
                      <span className="vw-ring r3" />
                    </div>
                  )}
                </div>

                {/* AUDIO WAVEFORM BARS WHILE SPEAKING ON LOAD */}
                <div className={`portrait-waveform ${isSpeakingActive ? 'active' : ''}`}>
                  {[...Array(12)].map((_, i) => (
                    <span key={i} className={`wf-bar wfb-${i + 1}`} />
                  ))}
                </div>

                <div className="portrait-caption">
                  <strong>PRASEETHA S</strong>
                  <span>AI & DS / FRONT-END</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a href="#about" className="hero-scroll-prompt" aria-label="Scroll Down">
          <i className="fa-solid fa-arrow-down-long" />
        </a>
      </section>

      {/* ══ 01 / ABOUT ══════════════════════════════ */}
      <section id="about" className="section about-section bg-alt">
        <div className="container">
          <div className="about-grid">
            <div>
              <span className="sec-num" style={{ color: 'var(--burgundy)' }}>01 / ABOUT</span>
              <h2 className="sec-title">CURIOUS BY NATURE.<br />BUILDER BY HABIT.</h2>
            </div>
            <div>
              <div className="about-copy">
                <p>I'm Praseetha S, a B.Tech Artificial Intelligence & Data Science student interested in front-end development, UI/UX and AI. I enjoy turning ideas into responsive, user-friendly digital experiences.</p>
                <p className="about-secondary">Learning by building, designing and experimenting.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 02 / WHAT I DO ══════════════════════════ */}
      <section id="what-i-do" className="section wid-section">
        <div className="container">
          <span className="sec-num" style={{ color: 'var(--green)' }}>02 / WHAT I DO</span>
          <div className="wid-cols">
            {[
              { title: 'DESIGN', items: ['UI / UX', 'Figma', 'Visual Design'] },
              { title: 'BUILD', items: ['Front-End', 'Responsive Websites', 'Web Interfaces'] },
              { title: 'EXPLORE', items: ['AI / ML', 'Data', 'AIoT'] },
            ].map((col, i) => (
              <div key={i} className="wid-col tilt-element"
                onMouseMove={handleTiltMove} onMouseLeave={handleTiltLeave} onMouseEnter={() => setCursorHover(true)}>
                <h3>{col.title}</h3>
                <ul className="wid-items">
                  {col.items.map(it => <li key={it}>{it}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 03 / EXPERIENCE ════════════════════════ */}
      <section id="experience" className="section exp-section">
        <div className="container">
          <span className="sec-num" style={{ color: 'var(--green)' }}>03 / EXPERIENCE</span>
          <div className="exp-card tilt-element" onMouseMove={handleTiltMove} onMouseLeave={handleTiltLeave} onMouseEnter={() => setCursorHover(true)}>
            <div>
              <div className="exp-role">Front-End Development Intern</div>
              <div className="exp-org">NXTLOGIC SOFTWARE SOLUTIONS · COIMBATORE</div>
              <div className="exp-desc">
                <p>15-day internship focused on front-end development, responsive interfaces and practical web development.</p>
                <p>Worked with requirements and user-focused interface implementation.</p>
              </div>
            </div>
            <div className="exp-meta">
              <div className="exp-date">17 JUN 2026 — 07 JUL 2026</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 04 / FEATURED PROJECTS ══════════════════ */}
      <section id="projects" className="section projects-section">
        <div className="container">
          <span className="sec-num" style={{ color: 'var(--orange)' }}>04 / FEATURED PROJECTS</span>
          <h2 className="sec-title">Featured Projects</h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--muted)', maxWidth: 780, marginBottom: '2.5rem', lineHeight: 1.6 }}>
            A selection of websites and digital experiences I've designed and developed, combining clean interfaces, responsive design and practical user experiences.
          </p>

          <div className="featured-grid">
            {featuredProjects.map((p, i) => (
              <div key={i} className="featured-card tilt-element"
                onMouseMove={handleTiltMove} onMouseLeave={handleTiltLeave} onMouseEnter={() => setCursorHover(true)}
                onClick={() => setSelectedProject(p)} style={{ cursor: 'pointer' }}>
                <div className="fc-thumb-wrap">
                  <a href={p.live} target="_blank" rel="noopener noreferrer" className="fc-thumb-link">
                    <img src={p.img} alt={p.alt} className="fc-thumb" loading="lazy" />
                  </a>
                </div>
                <div className="fc-body">
                  <span className="fc-cat">{p.cat}</span>
                  <h3 className="fc-title">{p.title}</h3>
                  <p className="fc-desc">{p.desc}</p>
                  <div className="fc-tech-wrap">
                    <div className="fc-tech-tags">
                      {p.tech.map(t => <span key={t} className="fc-tech-tag">{t}</span>)}
                    </div>
                  </div>
                  <div className="fc-actions">
                    {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer" className="fc-btn">🚀 Live Website ↗</a>}
                    {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" className="fc-btn github-btn">💻 GitHub ↗</a>}
                    {p.pages && <a href={p.pages} target="_blank" rel="noopener noreferrer" className="fc-btn pages-btn">🌐 GitHub Pages ↗</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── 05 / AI & INTELLIGENT SYSTEMS ── */}
          <div className="ai-projects-section" style={{ marginTop: '4.5rem', borderTop: '1px solid var(--line)', paddingTop: '3rem' }}>
            <span className="sec-num" style={{ color: 'var(--green)' }}>05 / AI & INTELLIGENT SYSTEMS</span>
            <h3 className="sec-title" style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', color: 'var(--ink)', marginBottom: '1.5rem', fontWeight: 400 }}>AI & System Concepts</h3>
            <div className="proj-list">
              {[
                { num: '01', img: 'assets/smartlift_thumb.jpg', name: 'SMARTLIFT', sub: 'AIoT-Powered Intelligent Lift Management', desc: 'An AIoT-based lift management concept exploring smarter decision-making and efficient elevator operation.', cat: 'AIoT / PROTOTYPE', status: 'inprog', statusText: '● IN PROGRESS', github: 'https://github.com/prasethdev/SmartLift' },
                { num: '02', img: 'assets/retrofit_thumb.jpg', name: 'RETROFIT AI EDGE 5.0', sub: 'Smart Retrofit Kit for Legacy Lathe Machines', desc: 'An affordable smart retrofit concept for modernising legacy lathe machines used in MSMEs.', cat: 'MSME / AUTOMATION', status: 'done', statusText: '✓ COMPLETED', github: 'https://github.com/prasethdev/RetroFit-AI-Edge-5.0' },
                { num: '03', img: 'assets/missing_person_thumb.jpg', name: 'AI MISSING PERSON ID SYSTEM', sub: null, desc: 'AI-based identification concept using facial information to assist missing-person identification.', cat: 'AI / COMPUTER VISION', status: null, statusText: null, github: 'https://github.com/Praseetha-S/AI-Based-Missing-Person---Unidentified-Body-Identification--System-' },
              ].map((p, i) => (
                <div key={i} className="proj-row tilt-element" onMouseMove={handleTiltMove} onMouseLeave={handleTiltLeave} onMouseEnter={() => setCursorHover(true)}>
                  <span className="pr-num">{p.num}</span>
                  <a href={p.github} target="_blank" rel="noopener noreferrer">
                    <img src={p.img} alt={p.name} className="row-thumb" />
                  </a>
                  <div className="pr-info">
                    <div className="pr-name">{p.name}</div>
                    {p.sub && <div className="pr-sub">{p.sub}</div>}
                    <p className="pr-desc-inline">{p.desc}</p>
                  </div>
                  <div className="pr-meta">
                    <span className="pr-cat">{p.cat}</span>
                    {p.status && <span className={`pr-status ${p.status}`}>{p.statusText}</span>}
                    <div className="pr-links">
                      <a href={p.github} target="_blank" rel="noopener noreferrer" className="pr-link-btn github">⌥ GITHUB</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── 06 / UI/UX DESIGN ── */}
          <div className="uiux-projects-section" style={{ marginTop: '4.5rem', borderTop: '1px solid var(--line)', paddingTop: '3rem' }}>
            <span className="sec-num" style={{ color: 'var(--mustard)' }}>06 / UI & UX DESIGN</span>
            <h3 className="sec-title" style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem', color: 'var(--ink)', marginBottom: '0.5rem', fontWeight: 400 }}>UI/UX Design Projects</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--muted)', maxWidth: 650, marginBottom: '2rem', lineHeight: 1.6 }}>
              Interface designs, visual concepts and interactive prototypes crafted in Figma.
            </p>
            <div className="featured-grid">
              {uiuxProjects.map((p, i) => (
                <div key={i} className="featured-card tilt-element"
                  onMouseMove={handleTiltMove} onMouseLeave={handleTiltLeave} onMouseEnter={() => setCursorHover(true)}
                  onClick={() => setSelectedProject(p)} style={{ cursor: 'pointer' }}>
                  <div className="fc-thumb-wrap">
                    <a href={p.live} target="_blank" rel="noopener noreferrer" className="fc-thumb-link">
                      <img src={p.img} alt={p.alt} className="fc-thumb" loading="lazy" />
                    </a>
                  </div>
                  <div className="fc-body">
                    <span className="fc-cat">{p.cat}</span>
                    <h3 className="fc-title">{p.title}</h3>
                    <div className="uiux-about-block" style={{ marginBottom: '1rem' }}>
                      <span style={{ display: 'block', fontFamily: 'var(--mono)', fontSize: '0.65rem', fontWeight: 700, color: 'var(--orange)' }}>About the Project</span>
                      <p className="fc-desc" style={{ marginBottom: 0, fontSize: '0.85rem', lineHeight: 1.55 }}>{p.desc}</p>
                    </div>
                    <div className="fc-tech-wrap">
                      <div className="fc-tech-tags">
                        {p.tech.map(t => <span key={t} className="fc-tech-tag">{t}</span>)}
                      </div>
                    </div>
                    <div className="fc-actions">
                      <a href={p.live} target="_blank" rel="noopener noreferrer" className="fc-btn">{p.liveLabel}</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ 08 / SKILLS TOOLKIT ══════════════════ */}
      <ToolsSection />

      {/* ══ PERSONAL STRENGTHS ════════════════════ */}
      <section className="section strengths-section">
        <div className="container">
          <div className="strengths-row">
            <span>QUICK LEARNER</span>
            <span className="dot-sep">·</span>
            <span>CREATIVE THINKER</span>
            <span className="dot-sep">·</span>
            <span>RESPONSIBLE</span>
          </div>
        </div>
      </section>

      {/* ══ 09 / CERTIFICATIONS ══════════════════ */}
      <section id="certifications" className="section cert-section bg-alt">
        <div className="container">
          <div className="cert-header-flex">
            <div>
              <span className="sec-num" style={{ color: 'var(--blue)' }}>09 / CERTIFICATIONS</span>
              <h2 className="sec-title">CREDENTIALS & ACCOMPLISHMENTS.</h2>
            </div>
            <div className="cert-sub-filter">
              {['all', 'awards', 'nptel', 'tech'].map(f => (
                <button key={f} className={`cert-filter-btn ${certFilter === f ? 'active' : ''}`}
                  onClick={() => setCertFilter(f)}>
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="cert-grid">
            {filteredCerts.map(cert => (
              <div key={cert.id} className="cert-card tilt-element"
                onClick={() => setSelectedCert(cert)}
                onMouseMove={handleTiltMove} onMouseLeave={handleTiltLeave} onMouseEnter={() => setCursorHover(true)}
                style={{ cursor: 'pointer' }}>
                <div className="cert-img-box">
                  <img src={cert.img} alt={cert.title} className="cert-img" loading="lazy" />
                  <span className={`cert-badge ${cert.badgeColor}`}>{cert.badge}</span>
                  <div className="cert-overlay">
                    <i className="fa-solid fa-expand" />
                    <span>VIEW CREDENTIAL</span>
                  </div>
                </div>
                <div className="cert-body">
                  <div className="ci-org">{cert.org}</div>
                  <h3 className="ci-title">{cert.title}</h3>
                  <div className="ci-meta">{cert.meta}</div>
                  <p className="ci-desc">{cert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CERT MODAL */}
      {selectedCert && <CertModal cert={selectedCert} onClose={() => setSelectedCert(null)} />}
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}

      {/* ══ 10 / EDUCATION ════════════════════════ */}
      <section id="education" className="section edu-section">
        <div className="container">
          <span className="sec-num" style={{ color: 'var(--blue)' }}>10 / EDUCATION</span>
          <div className="edu-compact-timeline">
            <div className="edu-row">
              <div className="er-left"><strong>B.TECH</strong><span>Artificial Intelligence & Data Science</span></div>
              <div className="er-right">Velalar College of Engineering and Technology, Erode<br /><span className="er-meta">2024 — 2028 · CGPA 7.84</span></div>
            </div>
            <div className="edu-row">
              <div className="er-left"><strong>HSE</strong></div>
              <div className="er-right">S S M Lakshmi Ammal Matric Hr Sec School<br />Komarapalayam<br /><span className="er-meta">72% · March 2024</span></div>
            </div>
            <div className="edu-row">
              <div className="er-left"><strong>SSLC</strong></div>
              <div className="er-right">S S M Lakshmi Ammal Matric Hr Sec School<br />Komarapalayam<br /><span className="er-meta">72.4% · May 2022</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 11 / HIGHLIGHTS ══════════════════════ */}
      <section id="highlights" className="section highlights-section">
        <div className="container">
          <span className="sec-num" style={{ color: 'var(--burgundy)' }}>11 / HIGHLIGHTS</span>
          <div className="hl-compact-list">
            <div className="hl-item"><strong>FIRST PRIZE</strong><span>College Poster Making Competition</span></div>
            <div className="hl-item"><strong>50 DAYS — 50 POSTERS</strong><span>Creative design challenge</span></div>
            <div className="hl-item"><strong>RETROFIT AI EDGE 5.0</strong><span>Round 2 — Selected</span></div>
          </div>
        </div>
      </section>

      {/* ══ 12 / BEYOND THE CLASSROOM ════════════ */}
      <section id="beyond" className="section beyond-section bg-alt">
        <div className="container">
          <span className="sec-num" style={{ color: 'var(--blue)' }}>12 / BEYOND THE CLASSROOM</span>
          <ul className="beyond-list">
            {['Workshops', 'Events', 'Competitions', 'Hackathons', 'Project presentations'].map(it => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ 13 / OFF THE SCREEN ═══════════════════ */}
      <section id="offscreen" className="section offscreen-section">
        <div className="container">
          <span className="sec-num" style={{ color: 'var(--burgundy)' }}>13 / OFF THE SCREEN</span>
          <h2 className="sec-title">WHEN I'M NOT CODING.</h2>
          <div className="offscreen-grid">
            {[
              { title: 'JOURNALING', desc: '1-Month journaling practice — capturing daily ideas, reflections & creative thoughts.', img: 'assets/journaling_thumb.jpg' },
              { title: 'POSTER MAKING', desc: 'Creative poster design.', img: 'assets/poster_making_thumb.jpg' },
              { title: 'PHOTO EDITING', desc: 'Visual editing and image work.', img: 'assets/photo_editing_thumb.jpg' },
              { title: 'VIDEO EDITING', desc: 'Creating and editing visual content.', img: 'assets/video_editing_thumb.jpg' },
            ].map((item, i) => (
              <div key={i} className="os-card-min tilt-element" onMouseMove={handleTiltMove} onMouseLeave={handleTiltLeave} onMouseEnter={() => setCursorHover(true)}>
                <img src={item.img} alt={item.title} className="os-thumb" loading="lazy" />
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}

            {/* Special DIY / Craft card with Instagram */}
            <a href="https://www.instagram.com/_twisted._.bloom_/" target="_blank" rel="noopener noreferrer"
              className="os-card-min os-card-special tilt-element"
              onMouseMove={handleTiltMove} onMouseLeave={handleTiltLeave} onMouseEnter={() => setCursorHover(true)}>
              <img src="assets/diy_craft_thumb.jpg" alt="Twisted Bloom" className="os-thumb" loading="lazy" />
              <h3>DIY / CRAFT</h3>
              <p>I handcraft & sell pipe cleaner art. Each piece is made with love 🌸</p>
              <div className="os-insta-badge">
                <i className="fa-brands fa-instagram" />
                <span>@_twisted._.bloom_</span>
                <span className="os-insta-arrow">↗</span>
              </div>
            </a>
          </div>
          <div style={{ marginTop: '2rem', fontStyle: 'italic', color: 'var(--muted)' }}>"I like making things — sometimes with code, sometimes with my hands."</div>
        </div>
      </section>

      {/* ══ STRIPE ═══════════════════════════════ */}
      <section className="stripe-section">
        <div className="container">
          <div className="stripe-grid">
            {[
              { h: 'BUILD', s: 'Projects · Interfaces · Experiments' },
              { h: 'LEARN', s: 'AI · ML · Web · Data' },
              { h: 'CONNECT', s: 'Collaborate · Create · Talk' },
            ].map((col, i) => (
              <div key={i} className="stripe-col"><h3>{col.h}</h3><span>{col.s}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTACT ══════════════════════════════ */}
      <section id="connect" className="section contact-section bg-alt">
        <div className="container">
          <div className="contact-header">
            <span className="sec-num" style={{ color: 'var(--burgundy)' }}>04 — CONTACT</span>
            <h2 className="sec-title" style={{ fontFamily: 'var(--serif)', fontWeight: 400, marginBottom: '0.5rem' }}>Let's Connect</h2>
            <p className="contact-subtitle">Have an idea, opportunity, or project in mind? I'd love to hear from you.</p>
          </div>
          <div className="contact-methods-grid">
            <a href="mailto:praseethasathish28@gmail.com" className="contact-method-card tilt-element"
              onMouseMove={handleTiltMove} onMouseLeave={handleTiltLeave} onMouseEnter={() => setCursorHover(true)}
              onClick={copyEmail}>
              <div className="cmc-icon"><i className="fa-solid fa-envelope" /></div>
              <div className="cmc-content"><span className="cmc-label">Email</span><span className="cmc-value">praseethasathish28@gmail.com</span></div>
              <div className="cmc-arrow">↗</div>
            </a>
            <a href="https://www.linkedin.com/in/praseetha-s-a37943331/" target="_blank" rel="noopener noreferrer" className="contact-method-card tilt-element"
              onMouseMove={handleTiltMove} onMouseLeave={handleTiltLeave} onMouseEnter={() => setCursorHover(true)}>
              <div className="cmc-icon"><i className="fa-brands fa-linkedin" /></div>
              <div className="cmc-content"><span className="cmc-label">LinkedIn</span><span className="cmc-value">linkedin.com/in/praseetha-s-a37943331</span></div>
              <div className="cmc-arrow">↗</div>
            </a>
            <a href="https://github.com/Praseetha-S" target="_blank" rel="noopener noreferrer" className="contact-method-card tilt-element"
              onMouseMove={handleTiltMove} onMouseLeave={handleTiltLeave} onMouseEnter={() => setCursorHover(true)}>
              <div className="cmc-icon"><i className="fa-brands fa-github" /></div>
              <div className="cmc-content"><span className="cmc-label">GitHub</span><span className="cmc-value">github.com/Praseetha-S</span></div>
              <div className="cmc-arrow">↗</div>
            </a>
          </div>
        </div>
      </section>

      {/* ══ THIRUKKURAL FLOW LINE ══════════════════ */}
      <div className="tk-flow-strip">
        <div className="tk-flow-track">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="tk-flow-content">
              <span className="tk-flow-dot">✶</span>
              <span className="tk-flow-tamil">ஒழுக்கம் விழுப்பம் தரலான் ஒழுக்கம் உயிரினும் ஓம்பப் படும்.</span>
              <span className="tk-flow-sep">—</span>
              <span className="tk-flow-en">Discipline leads to dignity. Guard it more precious than life itself.</span>
              <span className="tk-flow-sep">·</span>
              <span className="tk-flow-tag">திருக்குறள் 131 · Thiruvalluvar</span>
            </span>
          ))}
        </div>
      </div>

      {/* ══ FOOTER ═══════════════════════════════ */}
      <footer id="site-footer" className="site-footer-pro">
        <div className="container">
          <div className="footer-pro-top">
            <div className="f-brand-block">
              <a href="#hero" className="f-brand-name">Praseetha Sathish</a>
              <p className="f-brand-tagline">AI & Data Science Student • Front-End & UI/UX Developer</p>
              <div className="f-status-pill open-work">
                <span className="status-dot" />
                <span>OPEN FOR WORK</span>
              </div>
            </div>

            <div className="f-nav-block">
              <span className="f-nav-title">Connect</span>
              <div className="f-social-links">
                <a href="mailto:praseethasathish28@gmail.com" className="f-social-link"><i className="fa-solid fa-envelope" /> Email ↗</a>
                <a href="https://www.linkedin.com/in/praseetha-s-a37943331/" target="_blank" rel="noopener noreferrer" className="f-social-link"><i className="fa-brands fa-linkedin" /> LinkedIn ↗</a>
                <a href="https://github.com/Praseetha-S" target="_blank" rel="noopener noreferrer" className="f-social-link"><i className="fa-brands fa-github" /> GitHub ↗</a>
              </div>
            </div>
          </div>

          <div className="footer-pro-divider" />

          <div className="footer-pro-bottom">
            <p className="f-copy-text">© 2026 Praseetha Sathish. Designed & Built with precision.</p>
            <a href="#hero" className="f-top-btn">Back to Top <i className="fa-solid fa-arrow-up" /></a>
          </div>
        </div>
      </footer>

      {/* AI Assistant Floating Button */}
      <AIAssistant />
      
      {/* Global Toast for easter eggs and copy feedback */}
      {toastMessage && (
        <div className="global-toast" onClick={() => setToastMessage('')}>
          {toastMessage}
        </div>
      )}
    </>
  );
}

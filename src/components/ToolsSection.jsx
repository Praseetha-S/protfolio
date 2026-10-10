import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toolkitData } from '../data/skillsData';

const catIcons = {
  'PROGRAMMING':         'fa-solid fa-code',
  'TOOLS':               'fa-solid fa-screwdriver-wrench',
  'DESIGN':              'fa-solid fa-palette',
  'AI':                  'fa-solid fa-brain',
  'DATA':                'fa-solid fa-chart-pie',
  'SYSTEMS':             'fa-solid fa-server',
  'CURRENTLY EXPLORING': 'fa-solid fa-rocket'
};

export default function ToolsSection() {
  const [catIdx,   setCatIdx]   = useState(0);
  const [visible,  setVisible]  = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const sectionRef      = useRef(null);
  const catIdxRef       = useRef(0);
  const lockedRef       = useRef(false);
  const transRef        = useRef(false);
  const wheelBuf        = useRef(0);
  const touchStartY     = useRef(0);
  const cooldownRef     = useRef(false);   // blocks re-lock for 1.5s after unlock

  /* ── mobile detection ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  /* ── lock: just set flag + snap section to top ── */
  const lockBody = useCallback(() => {
    if (lockedRef.current || cooldownRef.current) return;
    lockedRef.current = true;
    wheelBuf.current  = 0;
    sectionRef.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
  }, []);

  /* ── unlock: release, jump past / before section ── */
  const unlockBody = useCallback((dir) => {
    if (!lockedRef.current) return;
    lockedRef.current  = false;
    cooldownRef.current = true;
    setTimeout(() => { cooldownRef.current = false; }, 1500);   // prevent immediate re-lock

    const section = sectionRef.current;
    if (section) {
      if (dir > 0) {
        // Jump well past section bottom so IO doesn't re-trigger
        window.scrollTo({ top: section.offsetTop + section.offsetHeight + window.innerHeight, behavior: 'auto' });
      } else {
        // Jump above section
        window.scrollTo({ top: Math.max(0, section.offsetTop - window.innerHeight), behavior: 'auto' });
      }
    }
  }, []);

  /* ── change category with fade animation ── */
  const changeCat = useCallback((dir) => {
    if (transRef.current) return;
    const next = catIdxRef.current + dir;
    if (next < 0 || next >= toolkitData.length) return;
    transRef.current = true;
    setVisible(false);
    setTimeout(() => {
      catIdxRef.current = next;
      setCatIdx(next);
      setVisible(true);
      setTimeout(() => { transRef.current = false; }, 80);
    }, 220);
  }, []);

  /* ── main scroll-lock effect ── */
  useEffect(() => {
    if (isMobile) return;
    const section = sectionRef.current;
    if (!section) return;

    /* IntersectionObserver: lock when section enters viewport */
    const io = new IntersectionObserver(entries => {
      const e = entries[0];
      if (e.isIntersecting && !lockedRef.current && !cooldownRef.current) {
        lockBody();
      }
    }, { threshold: 0.6 });
    io.observe(section);

    /* Wheel: when locked, intercept and cycle categories */
    const onWheel = (e) => {
      if (!lockedRef.current) return;
      e.preventDefault();
      e.stopPropagation();

      wheelBuf.current += e.deltaY;
      if (Math.abs(wheelBuf.current) < 50) return;

      const dir  = wheelBuf.current > 0 ? 1 : -1;
      wheelBuf.current = 0;
      const next = catIdxRef.current + dir;

      if (next < 0)                      { unlockBody(-1); }
      else if (next >= toolkitData.length) { unlockBody(1);  }
      else                               { changeCat(dir);  }
    };

    /* Touch */
    const onTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; };
    const onTouchEnd   = (e) => {
      if (!lockedRef.current) return;
      const dy  = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 40) return;
      const dir  = dy > 0 ? 1 : -1;
      const next = catIdxRef.current + dir;
      if (next < 0)                      { unlockBody(-1); }
      else if (next >= toolkitData.length) { unlockBody(1);  }
      else                               { changeCat(dir);  }
    };

    window.addEventListener('wheel',      onWheel,      { passive: false, capture: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend',   onTouchEnd,   { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener('wheel',      onWheel,      { capture: true });
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend',   onTouchEnd);
      lockedRef.current   = false;
      cooldownRef.current = false;
    };
  }, [isMobile, lockBody, unlockBody, changeCat]);

  /* ── jump via pill/button click ── */
  const jumpTo = useCallback((idx) => {
    if (idx < 0 || idx >= toolkitData.length || transRef.current) return;
    if (!isMobile && !lockedRef.current) lockBody();
    transRef.current = true;
    setVisible(false);
    setTimeout(() => {
      catIdxRef.current = idx;
      setCatIdx(idx);
      setVisible(true);
      setTimeout(() => { transRef.current = false; }, 80);
    }, 220);
  }, [isMobile, lockBody]);

  /* ── render ── */
  const cat        = toolkitData[catIdx];
  const leftItems  = cat.items.filter((_, i) => i % 2 === 0);
  const rightItems = cat.items.filter((_, i) => i % 2 === 1);
  const progress   = Math.round(((catIdx + 1) / toolkitData.length) * 100);

  return (
    <section id="skills" className="tks-section" ref={sectionRef}>
      <div className="tks-shell">

        {/* HEADER */}
        <div className="tks-header">
          <span className="sec-num" style={{ color: 'var(--orange)' }}>08 / DIGITAL WORKSHOP</span>
          <h2 className="sec-title" style={{ marginBottom: '0.2rem' }}>Technologies &amp; Tools I Work With</h2>
          <p className="tks-hint">
            {isMobile
              ? 'Tap a category to explore'
              : 'Scroll inside this section — skills burst out of the laptop per category'}
          </p>
        </div>

        {/* CATEGORY PILLS */}
        <div className="tks-pills">
          {toolkitData.map((c, i) => (
            <button
              key={i}
              className={'tks-pill' + (catIdx === i ? ' active' : '')}
              onClick={() => jumpTo(i)}
            >
              <i className={catIcons[c.category] || 'fa-solid fa-layer-group'} />
              <span>{c.category}</span>
              <em className="tks-pill-count">{c.items.length}</em>
            </button>
          ))}
        </div>

        {/* STAGE: left cards | laptop | right cards */}
        <div className="tks-stage">

          {/* LEFT */}
          <div className={'tks-col tks-col-left ' + (visible ? 'cards-in' : 'cards-out')}>
            {leftItems.map((tool, i) => (
              <SkillCard key={tool.name} tool={tool} delay={i * 0.08} dir="left" />
            ))}
          </div>

          {/* LAPTOP */}
          <div className="tks-laptop-wrap">
            <div className="tks-laptop-glow" />
            <div className="tks-laptop-screen">
              <div className="tks-tl-bar">
                <span className="tl r" /><span className="tl y" /><span className="tl g" />
                <span className="tks-tl-title">praseetha.dev / {cat.category.toLowerCase()}</span>
                <span className="tks-tl-chap">{cat.chapter}</span>
              </div>
              <div className="tks-screen-body">
                <div className="tks-scanlines" />
                <div className={'tks-screen-info ' + (visible ? 'si-in' : 'si-out')}>
                <div className="tks-screen-logo-wrap">
                  <img
                    src={cat.items[0]?.logo}
                    alt={cat.category}
                    className="tks-screen-logo"
                    onError={(e) => { e.target.style.display='none'; }}
                  />
                </div>
                <span className="tks-screen-cat">{cat.category}</span>
                <div className="tks-screen-skills">{cat.items.length} skills</div>
                <div className="tks-pulse-dot" />
              </div>
              </div>
            </div>
            <div className="tks-laptop-base"><div className="tks-laptop-notch" /></div>
          </div>

          {/* RIGHT */}
          <div className={'tks-col tks-col-right ' + (visible ? 'cards-in' : 'cards-out')}>
            {rightItems.map((tool, i) => (
              <SkillCard key={tool.name} tool={tool} delay={i * 0.08 + 0.04} dir="right" />
            ))}
          </div>

        </div>

        {/* PROGRESS + NAV */}
        <div className="tks-footer">
          <button className="tks-btn" onClick={() => jumpTo(catIdx - 1)} disabled={catIdx === 0}>
            <i className="fa-solid fa-chevron-left" /> Prev
          </button>
          <div className="tks-prog-track">
            <div className="tks-prog-fill" style={{ width: progress + '%' }} />
          </div>
          <span className="tks-prog-label">{catIdx + 1} / {toolkitData.length}</span>
          <button className="tks-btn" onClick={() => jumpTo(catIdx + 1)} disabled={catIdx === toolkitData.length - 1}>
            Next <i className="fa-solid fa-chevron-right" />
          </button>
        </div>

      </div>
    </section>
  );
}

function SkillCard({ tool, delay, dir }) {
  const [imgError, setImgError] = React.useState(false);
  return (
    <div
      className={'tks-card sk-' + dir}
      style={{ animationDelay: delay + 's', '--card-color': tool.color }}
    >
      <div className="tks-card-logo-wrap">
        {!imgError && tool.logo ? (
          <img
            src={tool.logo}
            alt={tool.name}
            className="tks-card-logo-img"
            onError={() => setImgError(true)}
          />
        ) : (
          <i className={tool.icon} style={{ color: tool.color, fontSize: '3rem' }} />
        )}
      </div>
      <h4 className="tks-card-name">{tool.name}</h4>
      <div className="tks-card-bar" style={{ background: tool.color }} />
    </div>
  );
}

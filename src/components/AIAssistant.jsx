import React, { useState, useEffect, useRef } from 'react';
import './AIAssistant.css';

/* ─── Knowledge base pulled from portfolio data ─── */
const KB = {
  name: 'Praseetha S',
  bio: "I'm Praseetha S, a B.Tech Artificial Intelligence & Data Science student interested in front-end development, UI/UX and AI. I enjoy turning ideas into responsive, user-friendly digital experiences.",
  tagline: 'B.Tech AI & Data Science Student · Front-End Developer · UI/UX Enthusiast',
  email: 'praseethasathish28@gmail.com',
  linkedin: 'https://www.linkedin.com/in/praseetha-s-a37943331/',
  github: 'https://github.com/Praseetha-S',
  resume: '/PRASEETHA_S_RESUME.pdf',
  education: 'B.Tech in Artificial Intelligence & Data Science at Velalar College of Engineering and Technology, Erode (2024–2028, CGPA 7.84).',
  experience: 'Front-End Development Intern at NXTLOGIC SOFTWARE SOLUTIONS, Coimbatore (June 17 – July 7, 2026). 15-day internship focused on front-end development and responsive interfaces.',
  featuredProjects: [
    { title: 'Sathya Group', cat: 'Corporate Website', desc: 'Responsive corporate website for Sathya Group.', tech: 'HTML, CSS, JavaScript, Figma', live: 'https://ornate-daffodil-e96abf.netlify.app/' },
    { title: 'Henna by Laksh', cat: 'Business Website', desc: 'Premium responsive business website for a henna artist with gallery, booking and contact.', tech: 'HTML, CSS, JavaScript', live: 'https://henna-by-laksh.netlify.app/' },
    { title: 'SD Aari Works', cat: 'Business Website', desc: 'Responsive business website for SD Aari Works.', tech: 'HTML, CSS, JavaScript', live: 'https://sd-aari.netlify.app/' },
    { title: 'Bake Theory', cat: 'Bakery Website', desc: 'Responsive bakery website showcasing products and categories.', tech: 'HTML, CSS, JavaScript', live: 'https://baketheorypraseetha.netlify.app/' },
    { title: 'Timeless Elegant Boutique', cat: 'Fashion Website', desc: 'Elegant responsive boutique website for fashion collections.', tech: 'HTML, CSS, JavaScript', live: 'https://boutique-timeless-elegant.netlify.app/' },
    { title: 'Sri Krishna Hospital', cat: 'Healthcare Website', desc: 'Professional healthcare website for hospital information and services.', tech: 'HTML, CSS, JavaScript', live: 'https://sri-krishnahospital.netlify.app/' },
    { title: 'Gym134', cat: 'Fitness Website', desc: 'Modern fitness website with bold visual style.', tech: 'HTML, CSS, JavaScript', live: 'https://gym134.netlify.app/' },
  ],
  aiProjects: [
    { title: 'SmartLift', cat: 'AIoT', desc: 'AIoT-based intelligent lift management concept.', status: 'In Progress', github: 'https://github.com/prasethdev/SmartLift' },
    { title: 'Retrofit AI Edge 5.0', cat: 'MSME Automation', desc: 'Smart retrofit kit for legacy lathe machines.', status: 'Completed', github: 'https://github.com/prasethdev/RetroFit-AI-Edge-5.0' },
    { title: 'AI Missing Person ID System', cat: 'Computer Vision', desc: 'AI-based missing person identification using facial recognition.', github: 'https://github.com/Praseetha-S/AI-Based-Missing-Person---Unidentified-Body-Identification--System-' },
  ],
  uiuxProjects: [
    { title: 'Poster Showcase', desc: 'Creative poster showcase interface.', tech: 'Figma' },
    { title: 'Foodzy App', desc: 'Food delivery app UI/UX design.', tech: 'Figma' },
    { title: 'Movie Booking App', desc: 'Interactive movie ticket booking prototype.', tech: 'Figma' },
  ],
  skills: 'Programming: Python, Java, C (Basic), SQL. Tools: VS Code, GitHub, Figma, Canva, Netlify, Vercel. Design: UI/UX, Figma. AI/ML: Artificial Intelligence, Machine Learning. Data: Data Science, Big Data. Systems: Windows, Linux (Basic). Exploring: AIoT, AI-assisted Development, Vibe Coding.',
  certifications: 'NPTEL Soft Skills (90%, Gold Medal, Top 1%), NPTEL Cloud Computing (Elite), NPTEL Privacy & Security, NPTEL HCI (Elite, 75%), GUVI AI for Women, GUVI Data Science, Figma Bootcamp (Kongu Engineering College), Project Expo 2K25 Winner, Celesta 25 National Winner, IdeaFest 25 Innovation Pitch.',
  highlights: 'First Prize in College Poster Making Competition. 50-day 50-poster creative design challenge. Retrofit AI Edge 5.0 selected for Round 2. Top 1% NPTEL ranker.',
  interests: 'Journaling, poster making, photo editing, video editing, DIY/craft.',
};

/* ─── Pattern matching responses ─── */
function getResponse(msg) {
  const m = msg.toLowerCase().trim();

  if (/who.*praseetha|about.*praseetha|introduce|who are you|tell me about/i.test(m)) {
    return `Hi! ${KB.bio}\n\nI'm currently a ${KB.tagline}.`;
  }
  if (/contact|reach|email|gmail|linkedin|github|hire|connect/i.test(m)) {
    return `You can reach Praseetha here:\n📧 ${KB.email}\n💼 LinkedIn → ${KB.linkedin}\n🐙 GitHub → ${KB.github}\n📄 Resume → ${KB.resume}`;
  }
  if (/education|college|degree|study|university|b\.?tech|cgpa/i.test(m)) {
    return `🎓 ${KB.education}`;
  }
  if (/experience|intern|job|work/i.test(m)) {
    return `💼 ${KB.experience}`;
  }
  if (/ai project|aiot|smartlift|retrofit|missing person|intelligent|machine learning project/i.test(m)) {
    return `Here are Praseetha's AI & Intelligent Systems projects:\n\n${KB.aiProjects.map(p => `• **${p.title}** (${p.cat})\n  ${p.desc}${p.status ? ' [' + p.status + ']' : ''}`).join('\n\n')}`;
  }
  if (/ui.*ux|figma|design project|poster|foodzy|movie booking/i.test(m)) {
    return `Here are Praseetha's UI/UX design projects:\n\n${KB.uiuxProjects.map(p => `• **${p.title}** — ${p.desc} (${p.tech})`).join('\n')}`;
  }
  if (/project|website|built|portfolio|work.*on|show.*project/i.test(m)) {
    const names = KB.featuredProjects.map(p => `• **${p.title}** — ${p.cat}`).join('\n');
    return `Praseetha has built ${KB.featuredProjects.length} featured web projects:\n\n${names}\n\nPlus 3 AI concepts and 3 UI/UX Figma prototypes. Ask me about any specific one!`;
  }
  if (/skill|tech|language|tool|python|java|html|css|javascript|figma|canva|react/i.test(m)) {
    return `Here's what Praseetha works with:\n\n🖥️ ${KB.skills}`;
  }
  if (/cert|certification|nptel|guvi|achievement|award|prize|winner/i.test(m)) {
    return `📜 Praseetha's certifications & achievements:\n\n${KB.certifications}`;
  }
  if (/highlight|accomplishment|notable|top 1/i.test(m)) {
    return `✨ Notable highlights:\n${KB.highlights}`;
  }
  if (/frontend|front-end|html|css|javascript|web/i.test(m)) {
    return `Praseetha builds front-end websites using HTML, CSS, JavaScript and React. She has delivered 7 client & personal web projects. She also uses Figma for UI/UX design.`;
  }
  if (/interest|hobby|passion|off.*screen|personal/i.test(m)) {
    return `Beyond coding, Praseetha enjoys: ${KB.interests}. She believes in making things — sometimes with code, sometimes with her hands! 🎨`;
  }
  if (/hello|hi|hey|namaste|vanakkam|good morning|good afternoon/i.test(m)) {
    return `Hi there! 👋 I'm Praseetha's AI assistant. I can tell you about her projects, skills, certifications, experience, or how to contact her. What would you like to know?`;
  }
  if (/thanks|thank you|great|awesome|nice/i.test(m)) {
    return `You're welcome! 😊 Feel free to ask anything else about Praseetha's portfolio.`;
  }

  return `I can answer questions about Praseetha's projects, skills, certifications, experience, education, or how to contact her. Try asking:\n• "What projects has she built?"\n• "What are her skills?"\n• "How can I contact her?"\n• "Tell me about her AI projects"`;
}

/* ─── Format text with bold and line breaks ─── */
function FormattedText({ text }) {
  return (
    <div className="ai-msg-text">
      {text.split('\n').map((line, i) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} style={{ margin: '0 0 0.25rem' }}>
            {parts.map((part, j) =>
              part.startsWith('**') && part.endsWith('**')
                ? <strong key={j}>{part.slice(2, -2)}</strong>
                : part
            )}
          </p>
        );
      })}
    </div>
  );
}

const SUGGESTIONS = [
  'Who is Praseetha?',
  'What projects has she built?',
  'What are her skills?',
  'How can I contact her?',
  'Tell me about her AI projects',
  'Any certifications?',
];

export default function AIAssistant() {
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([
    { from: 'ai', text: "Hi! I'm Praseetha's AI assistant. Ask me anything about her projects, skills, experience, or how to contact her. 👋" }
  ]);
  const [input, setInput]     = useState('');
  const [typing, setTyping]   = useState(false);
  const [showDot, setShowDot] = useState(true);
  const bottomRef             = useRef(null);
  const inputRef              = useRef(null);

  // Pulse notification dot (disappears once opened)
  useEffect(() => {
    if (open) setShowDot(false);
  }, [open]);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages]);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const send = (text) => {
    const q = (text || input).trim();
    if (!q) return;
    setInput('');
    setMessages(prev => [...prev, { from: 'user', text: q }]);
    setTyping(true);
    setTimeout(() => {
      const answer = getResponse(q);
      setMessages(prev => [...prev, { from: 'ai', text: answer }]);
      setTyping(false);
    }, 650 + Math.random() * 400);
  };

  const onKey = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  return (
    <>
      {/* Floating trigger */}
      <button
        className={'ai-fab' + (open ? ' ai-fab-open' : '')}
        onClick={() => setOpen(o => !o)}
        aria-label="Open AI assistant"
        title="Ask Praseetha AI"
      >
        {open ? <i className="fa-solid fa-xmark" /> : <><i className="fa-solid fa-sparkles" /><span>Ask Praseetha AI</span></>}
        {showDot && !open && <span className="ai-fab-dot" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="ai-panel" role="dialog" aria-modal="true" aria-label="AI Portfolio Assistant">
          <div className="ai-panel-header">
            <div className="ai-panel-avatar">
              <img src="/assets/profile.jpeg" alt="Praseetha" />
              <span className="ai-online-dot" />
            </div>
            <div className="ai-panel-info">
              <span className="ai-panel-name">Praseetha AI</span>
              <span className="ai-panel-sub">Portfolio Assistant · Always online</span>
            </div>
            <button className="ai-panel-close" onClick={() => setOpen(false)} aria-label="Close">
              <i className="fa-solid fa-xmark" />
            </button>
          </div>

          <div className="ai-messages">
            {messages.map((msg, i) => (
              <div key={i} className={'ai-bubble-wrap ' + msg.from}>
                {msg.from === 'ai' && (
                  <div className="ai-bubble-avatar">
                    <i className="fa-solid fa-sparkles" />
                  </div>
                )}
                <div className={'ai-bubble ' + msg.from}>
                  <FormattedText text={msg.text} />
                </div>
              </div>
            ))}
            {typing && (
              <div className="ai-bubble-wrap ai">
                <div className="ai-bubble-avatar"><i className="fa-solid fa-sparkles" /></div>
                <div className="ai-bubble ai ai-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions */}
          {messages.length <= 2 && (
            <div className="ai-suggestions">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} className="ai-suggestion-btn" onClick={() => send(s)}>{s}</button>
              ))}
            </div>
          )}

          <div className="ai-input-bar">
            <input
              ref={inputRef}
              type="text"
              className="ai-input"
              placeholder="Ask anything about Praseetha..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              maxLength={200}
            />
            <button className="ai-send-btn" onClick={() => send()} disabled={!input.trim()} aria-label="Send">
              <i className="fa-solid fa-paper-plane" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

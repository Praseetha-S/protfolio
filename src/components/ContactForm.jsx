import React, { useState, useRef } from 'react';
import './ContactForm.css';

const INTENTS = [
  { id: 'project',     icon: 'fa-solid fa-lightbulb',        label: 'I have a project idea' },
  { id: 'collab',      icon: 'fa-solid fa-handshake',         label: 'I want to collaborate' },
  { id: 'hiring',      icon: 'fa-solid fa-briefcase',         label: "I'm interested in hiring" },
  { id: 'discuss',     icon: 'fa-solid fa-comments',          label: 'I want to discuss something' },
  { id: 'hi',          icon: 'fa-solid fa-hand-wave',         label: 'Just saying hi!' },
];

const STEP_LABELS = {
  project:  'What are you building?',
  collab:   'What would we work on?',
  hiring:   'What role are you considering?',
  discuss:  "What's on your mind?",
  hi:       "Any message for Praseetha?",
};

export default function ContactForm() {
  const [step, setStep]       = useState(0);   // 0=intent, 1=name, 2=topic, 3=email, 4=voice, 5=done
  const [intent, setIntent]   = useState(null);
  const [name, setName]       = useState('');
  const [topic, setTopic]     = useState('');
  const [email, setEmail]     = useState('');
  const [sending, setSending] = useState(false);

  // Voice recording
  const [recording, setRecording]       = useState(false);
  const [audioBlob, setAudioBlob]       = useState(null);
  const [audioURL, setAudioURL]         = useState('');
  const [recTime, setRecTime]           = useState(0);
  const [micError, setMicError]         = useState('');
  const mediaRecRef   = useRef(null);
  const timerRef      = useRef(null);
  const chunksRef     = useRef([]);

  const pickIntent = (id) => { setIntent(id); setStep(1); };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => Math.max(0, s - 1));

  const handleSend = () => {
    setSending(true);
    // mailto fallback — assembles the message
    const body = `Name: ${name}\nIntent: ${intent}\nMessage: ${topic}\nEmail: ${email}`;
    const mailLink = `mailto:praseethasathish28@gmail.com?subject=Portfolio Contact — ${INTENTS.find(i=>i.id===intent)?.label}&body=${encodeURIComponent(body)}`;
    window.open(mailLink, '_blank');
    setTimeout(() => { setSending(false); setStep(5); }, 800);
  };

  // Voice recording helpers
  const startRecording = async () => {
    setMicError('');
    setAudioBlob(null);
    setAudioURL('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mr = new MediaRecorder(stream);
      mediaRecRef.current = mr;
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        setRecording(false);
        clearInterval(timerRef.current);
      };
      mr.start();
      setRecording(true);
      setRecTime(0);
      timerRef.current = setInterval(() => {
        setRecTime(t => {
          if (t >= 29) { mr.stop(); return 30; }
          return t + 1;
        });
      }, 1000);
    } catch (err) {
      setMicError('Microphone access was denied. Please use the text form above instead.');
    }
  };

  const stopRecording = () => {
    if (mediaRecRef.current && recording) {
      mediaRecRef.current.stop();
      clearInterval(timerRef.current);
    }
  };

  const discardRecording = () => {
    setAudioBlob(null);
    setAudioURL('');
    setRecTime(0);
  };

  const reset = () => {
    setStep(0); setIntent(null); setName(''); setTopic(''); setEmail('');
    setAudioBlob(null); setAudioURL(''); setRecTime(0); setMicError('');
  };

  const fmtTime = (s) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  return (
    <div className="cf-wrap">
      <div className="cf-card">

        {/* STEP 0 — INTENT */}
        {step === 0 && (
          <div className="cf-step" key="step0">
            <span className="cf-eyebrow">04 — CONTACT</span>
            <h2 className="cf-heading">What's on your mind?</h2>
            <p className="cf-sub">Pick what brings you here and I'll make the conversation easy.</p>
            <div className="cf-intents">
              {INTENTS.map(it => (
                <button key={it.id} className="cf-intent-btn" onClick={() => pickIntent(it.id)}>
                  <i className={it.icon} />
                  <span>{it.label}</span>
                  <i className="fa-solid fa-arrow-right cf-intent-arrow" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1 — NAME */}
        {step === 1 && (
          <div className="cf-step" key="step1">
            <button className="cf-back" onClick={prevStep}><i className="fa-solid fa-arrow-left" /> Back</button>
            <div className="cf-intent-chip">
              <i className={INTENTS.find(i=>i.id===intent)?.icon} />
              {INTENTS.find(i=>i.id===intent)?.label}
            </div>
            <h2 className="cf-heading">What should I call you?</h2>
            <div className="cf-field-wrap">
              <input
                className="cf-input"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && name.trim() && nextStep()}
                autoFocus
              />
              <button
                className="cf-next-btn"
                onClick={nextStep}
                disabled={!name.trim()}
              >
                Continue <i className="fa-solid fa-arrow-right" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — TOPIC */}
        {step === 2 && (
          <div className="cf-step" key="step2">
            <button className="cf-back" onClick={prevStep}><i className="fa-solid fa-arrow-left" /> Back</button>
            <p className="cf-greeting">Hey {name} 👋</p>
            <h2 className="cf-heading">{STEP_LABELS[intent]}</h2>
            <div className="cf-field-wrap">
              <textarea
                className="cf-textarea"
                placeholder="Tell me a little about it..."
                value={topic}
                onChange={e => setTopic(e.target.value)}
                rows={3}
                autoFocus
              />
              <button className="cf-next-btn" onClick={nextStep} disabled={!topic.trim()}>
                Continue <i className="fa-solid fa-arrow-right" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — EMAIL */}
        {step === 3 && (
          <div className="cf-step" key="step3">
            <button className="cf-back" onClick={prevStep}><i className="fa-solid fa-arrow-left" /> Back</button>
            <h2 className="cf-heading">Where can I reach you?</h2>
            <p className="cf-sub">I reply within 24 hours.</p>
            <div className="cf-field-wrap">
              <input
                className="cf-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && email.trim() && nextStep()}
                autoFocus
              />
              <button className="cf-next-btn" onClick={nextStep} disabled={!email.trim()}>
                Continue <i className="fa-solid fa-arrow-right" />
              </button>
            </div>

            {/* Voice option */}
            <div className="cf-voice-toggle">
              <span className="cf-voice-label">🎙 Prefer talking?</span>
              <button className="cf-voice-alt" onClick={() => setStep(4)}>Record a voice note instead</button>
            </div>
          </div>
        )}

        {/* STEP 4 — VOICE MESSAGE */}
        {step === 4 && (
          <div className="cf-step" key="step4">
            <button className="cf-back" onClick={prevStep}><i className="fa-solid fa-arrow-left" /> Back to text</button>
            <h2 className="cf-heading">Record a voice note</h2>
            <p className="cf-sub">Max 30 seconds. Only you control when it starts.</p>

            {micError && <div className="cf-mic-error"><i className="fa-solid fa-triangle-exclamation" /> {micError}</div>}

            {!audioURL && (
              <div className="cf-recorder">
                {!recording ? (
                  <button className="cf-rec-btn start" onClick={startRecording}>
                    <i className="fa-solid fa-microphone" /> Start Recording
                  </button>
                ) : (
                  <div className="cf-recording-active">
                    <div className="cf-rec-indicator">
                      <span className="cf-rec-dot" />
                      <span>Recording...</span>
                    </div>
                    <div className="cf-rec-timer">{fmtTime(recTime)}</div>
                    <div className="cf-rec-bar">
                      <div className="cf-rec-fill" style={{ width: `${(recTime/30)*100}%` }} />
                    </div>
                    <button className="cf-rec-btn stop" onClick={stopRecording}>
                      <i className="fa-solid fa-stop" /> Stop
                    </button>
                  </div>
                )}
              </div>
            )}

            {audioURL && (
              <div className="cf-audio-preview">
                <audio controls src={audioURL} className="cf-audio-player" />
                <div className="cf-audio-actions">
                  <button className="cf-btn-discard" onClick={discardRecording}>
                    <i className="fa-solid fa-trash" /> Discard
                  </button>
                  <button className="cf-next-btn" onClick={handleSend} disabled={sending}>
                    {sending ? 'Sending...' : <><i className="fa-solid fa-paper-plane" /> Send Note</>}
                  </button>
                </div>
                <p className="cf-audio-note">Note: Voice note opens your email client for sending.</p>
              </div>
            )}
          </div>
        )}

        {/* STEP 5 — SUCCESS */}
        {step === 5 && (
          <div className="cf-step cf-success" key="step5">
            <div className="cf-success-icon">🚀</div>
            <h2 className="cf-heading">Your idea just took off!</h2>
            <p className="cf-sub">
              Thanks, {name}! Praseetha will get back to you at <strong>{email}</strong> within 24 hours.
            </p>
            <div className="cf-success-path">
              <span>Your message</span>
              <span className="cf-path-dot">✦</span>
              <span>Praseetha's inbox</span>
              <span className="cf-path-dot">✦</span>
              <span>Reply incoming 📬</span>
            </div>
            <button className="cf-next-btn" onClick={reset} style={{ marginTop: '1.5rem' }}>
              Send another message
            </button>
          </div>
        )}

      </div>

      {/* Progress dots */}
      {step > 0 && step < 5 && (
        <div className="cf-progress">
          {[1,2,3].map(s => (
            <span key={s} className={'cf-prog-dot' + (step >= s ? ' done' : '')} />
          ))}
        </div>
      )}
    </div>
  );
}

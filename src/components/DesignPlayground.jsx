import React, { useState } from 'react';
import './DesignPlayground.css';

const THEMES = [
  { id: 'flat', name: 'Flat & Clean', classes: 'dp-flat' },
  { id: 'glass', name: 'Glassmorphism', classes: 'dp-glass' },
  { id: 'brutal', name: 'Neobrutalism', classes: 'dp-brutal' },
];

const COLORS = [
  { id: 'burgundy', var: 'var(--burgundy)', bg: '#4a0e17' },
  { id: 'ink',      var: 'var(--ink)',      bg: '#1a1216' },
  { id: 'orange',   var: 'var(--orange)',   bg: '#d75c37' },
  { id: 'blue',     var: 'var(--blue)',     bg: '#3b5b78' },
];

export default function DesignPlayground() {
  const [theme, setTheme] = useState(THEMES[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [radius, setRadius] = useState(12); // px
  
  return (
    <section className="section dp-section bg-alt" id="design-playground">
      <div className="container">
        <div className="dp-header">
          <span className="sec-num" style={{ color: 'var(--orange)' }}>UI LAB</span>
          <h2 className="sec-title">Interactive UI Playground</h2>
          <p className="dp-subtitle">Experiment with design systems in real-time. This component demonstrates state management, CSS variables, and dynamic styling.</p>
        </div>

        <div className="dp-grid">
          {/* Controls Panel */}
          <div className="dp-controls tilt-element">
            <h3 className="dp-controls-title">Design Tokens</h3>
            
            <div className="dp-control-group">
              <label>Aesthetic Style</label>
              <div className="dp-theme-picker">
                {THEMES.map(t => (
                  <button 
                    key={t.id} 
                    className={`dp-theme-btn ${theme.id === t.id ? 'active' : ''}`}
                    onClick={() => setTheme(t)}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="dp-control-group">
              <label>Accent Color</label>
              <div className="dp-color-picker">
                {COLORS.map(c => (
                  <button 
                    key={c.id} 
                    className={`dp-color-btn ${color.id === c.id ? 'active' : ''}`}
                    style={{ backgroundColor: c.bg }}
                    onClick={() => setColor(c)}
                    aria-label={c.id}
                  />
                ))}
              </div>
            </div>

            <div className="dp-control-group">
              <label>Border Radius: {radius}px</label>
              <input 
                type="range" 
                min="0" max="32" 
                value={radius} 
                onChange={(e) => setRadius(e.target.value)}
                className="dp-slider"
              />
            </div>
          </div>

          {/* Preview Panel */}
          <div className="dp-preview-area tilt-element">
            {/* The preview applies the selected theme class and inline styles for dynamic variables */}
            <div 
              className={`dp-preview-box ${theme.classes}`}
              style={{
                '--dp-accent': color.var,
                '--dp-accent-hex': color.bg,
                '--dp-radius': `${radius}px`
              }}
            >
              
              {/* Fake UI component inside the preview box */}
              <div className="dp-card">
                <div className="dp-card-img" />
                <div className="dp-card-body">
                  <div className="dp-badge">Design System</div>
                  <h4 className="dp-card-title">Interactive Component</h4>
                  <p className="dp-card-text">
                    This card reacts to the design tokens you adjust on the left.
                  </p>
                  <button className="dp-card-btn">Click Me</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

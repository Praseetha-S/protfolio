import React, { useEffect, useCallback } from 'react';
import './ProjectModal.css';

export default function ProjectModal({ project, onClose }) {
  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  if (!project) return null;

  return (
    <div className="pm-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={project.title}>
      <div className="pm-panel" onClick={e => e.stopPropagation()}>

        {/* Close */}
        <button className="pm-close" onClick={onClose} aria-label="Close project detail">
          <i className="fa-solid fa-xmark" />
        </button>

        {/* Image */}
        <div className="pm-image-wrap">
          <img src={project.img} alt={project.title} className="pm-image" loading="lazy" />
          <div className="pm-image-overlay" />
          <div className="pm-image-badge">{project.cat}</div>
        </div>

        {/* Body */}
        <div className="pm-body">
          <h2 className="pm-title">{project.title}</h2>
          <p className="pm-desc">{project.desc}</p>

          {project.tech && project.tech.length > 0 && (
            <div className="pm-tech-section">
              <span className="pm-tech-label">Built With</span>
              <div className="pm-tech-tags">
                {project.tech.map(t => <span key={t} className="pm-tech-tag">{t}</span>)}
              </div>
            </div>
          )}

          <div className="pm-actions">
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="pm-btn primary">
                <i className="fa-solid fa-arrow-up-right-from-square" /> Live Website
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="pm-btn outline">
                <i className="fa-brands fa-github" /> GitHub
              </a>
            )}
            {project.liveLabel && project.live && !project.github && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="pm-btn primary">
                {project.liveLabel}
              </a>
            )}
            {project.pages && (
              <a href={project.pages} target="_blank" rel="noopener noreferrer" className="pm-btn outline">
                <i className="fa-brands fa-github" /> GitHub Pages
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';

// ── Fade up on scroll into view ──────────────────
export function FadeUp({ children, delay = 0, className = '', style = {}, ...rest }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: [0.19, 1, 0.22, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// ── Fade from left ───────────────────────────────
export function FadeLeft({ children, delay = 0, className = '', ...rest }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: -60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: [0.19, 1, 0.22, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// ── Fade from right ──────────────────────────────
export function FadeRight({ children, delay = 0, className = '', ...rest }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: [0.19, 1, 0.22, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// ── Scale in (for cards, modals) ─────────────────
export function ScaleIn({ children, delay = 0, className = '', ...rest }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay, ease: [0.19, 1, 0.22, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

// ── Stagger container ────────────────────────────
// Wrap children that are each <motion.div> with stagger
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

export const staggerItem = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.19, 1, 0.22, 1] }
  }
};

// ── Hover lift (for cards) ───────────────────────
export const hoverLift = {
  whileHover: { y: -8, transition: { duration: 0.3, ease: [0.19, 1, 0.22, 1] } },
};

import React from 'react';

export function SiteAmbientCanvas() {
  return (
    <div aria-hidden="true" className="site-ambient-canvas">
      <div className="site-ambient-orb site-ambient-orb--top" />
      <div className="site-ambient-orb site-ambient-orb--center" />
      <div className="site-ambient-orb site-ambient-orb--bottom" />
      <div className="site-ambient-ribbon site-ambient-ribbon--primary" />
      <div className="site-ambient-ribbon site-ambient-ribbon--secondary" />
      <div className="site-ambient-axis site-ambient-axis--right" />
      <div className="site-ambient-axis site-ambient-axis--left" />
    </div>
  );
}

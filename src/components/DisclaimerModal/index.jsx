import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

export default function DisclaimerModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    // Check if user has already accepted the disclaimer
    const hasAccepted = localStorage.getItem('portdive-disclaimer-accepted');

    if (!hasAccepted) {
      // Small delay to allow page to load before showing modal
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsAccepted(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('portdive-disclaimer-accepted', 'true');
    setIsAccepted(true);
    setIsVisible(false);
  };

  const handleReject = () => {
    // Redirect to homepage or show message
    window.location.href = '/portdive-pages/';
  };

  // Don't render if already accepted
  if (isAccepted || !isVisible) {
    return null;
  }

  return (
    <>
      <div className={styles.overlay} />
      <div className={styles.modal}>
        <div className={styles.content}>
          <div className={styles.icon}>⚠️</div>

          <h2 className={styles.title}>Important Disclaimer</h2>

          <div className={styles.text}>
            <p>
              These reports are for <strong>informational and educational purposes only</strong>.
              A report does NOT constitute investment advice, a buy/sell recommendation, or an
              offer to buy/sell any security. Past performance does not guarantee future results.
              All trading involves risk; you may lose invested capital.
            </p>
            <p>
              The Elliott Wave methodology, Fibonacci retracement levels, and technical indicators
              are tools for analysis but not certainties. Fundamental assumptions (revenue growth
              rates, margin expansion, multiple re-rating, catalyst execution) are subject to change.
            </p>
            <p className={styles.highlight}>
              <strong>AI Hallucinations</strong> may be part of the reasoning process and create
              false assumptions, predictions and statements.
            </p>
          </div>

          <div className={styles.copyright}>
            <p>© PortDive UG. — AI-GENERATED ANALYSIS</p>
            <p>NO FINANCIAL ADVICE, USE RESPONSIBLY.</p>
          </div>

          <div className={styles.buttons}>
            <button
              className={styles.rejectButton}
              onClick={handleReject}
              aria-label="Reject terms and return to homepage"
            >
              Reject
            </button>
            <button
              className={styles.acceptButton}
              onClick={handleAccept}
              aria-label="Accept terms and continue"
            >
              Accept Terms
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

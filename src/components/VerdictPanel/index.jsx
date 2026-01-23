/**
 * VerdictPanel Component
 * Renders chart analysis verdict with PortDive 2.0 design
 *
 * @component
 * @example
 * import VerdictPanel from '@site/src/components/VerdictPanel';
 *
 * <VerdictPanel
 *   verdict="## Primary scenario plan (rules + invalidation)\n\n**Most likely path (60%):**..."
 * />
 */

import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import styles from "./styles.module.css";

/**
 * Custom markdown components with PortDive styling
 */
const markdownComponents = {
  h2: ({ node, ...props }) => <h2 className={styles.verdictTitle} {...props} />,
  h3: ({ node, ...props }) => (
    <h3 className={styles.sectionHeading} {...props} />
  ),
  p: ({ node, ...props }) => <p className={styles.verdictText} {...props} />,
  strong: ({ node, ...props }) => (
    <strong className={styles.verdictStrong} {...props} />
  ),
  ul: ({ node, ...props }) => <ul className={styles.verdictList} {...props} />,
  li: ({ node, ...props }) => (
    <li className={styles.verdictListItem} {...props} />
  ),
  code: ({ node, ...props }) => (
    <code className={styles.verdictCode} {...props} />
  ),
};

/**
 * VerdictPanel Component
 * @param {string} verdict - Markdown string with analysis verdict
 * @param {string} className - Optional CSS class names
 */
export default function VerdictPanel({ verdict, theme, className = "" }) {
  return (
    <div className={`${styles.verdictPanelWrapper} ${className}`}>
      {/* Main content */}
      <div className={styles.verdictContent}>
        <ReactMarkdown components={markdownComponents}>{verdict}</ReactMarkdown>
      </div>

      {/* Footer badge */}
      <div className={styles.verdictFooter}>
        <span className={styles.verdictBadge}>Analysis Verdict</span>
      </div>
    </div>
  );
}

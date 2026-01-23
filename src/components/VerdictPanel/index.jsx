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

import ReactMarkdown from "react-markdown";
import styles from "./styles.module.css";

/**
 * Create custom markdown components with conditional styling
 * based on whether we're in a motive or corrective wave
 */
const createMarkdownComponents = (isCorrective) => {
  // Track current section context for styling
  let currentSection = null;

  /**
   * Extract plain text from children (handles nested elements and bold markdown)
   */
  const getPlainText = (children) => {
    if (typeof children === 'string') return children;
    if (Array.isArray(children)) {
      return children.map(getPlainText).join('');
    }
    if (children?.props?.children) {
      return getPlainText(children.props.children);
    }
    return String(children);
  };

  /**
   * Get section-specific class based on current section and wave type
   * Returns: "success" or "warning"
   */
  const getSectionStyle = () => {
    if (!currentSection) return "";

    // Motive waves (isCorrective=false): Validation=success, Invalidation=warning
    // Corrective waves (isCorrective=true): Validation=warning, Invalidation=success
    if (currentSection === "validation") {
      return isCorrective ? "warning" : "success";
    } else if (currentSection === "invalidation") {
      return isCorrective ? "success" : "warning";
    }
    return "";
  };

  return {
    h2: ({ node, children, ...props }) => {
      const text = getPlainText(children);

      // Detect Validation/Invalidation sections (case-insensitive)
      // IMPORTANT: Check "invalidation" BEFORE "validation" since "validation" is a substring
      if (/invalidation/i.test(text)) {
        currentSection = "invalidation";
      } else if (/validation/i.test(text)) {
        currentSection = "validation";
      } else {
        currentSection = null;
      }

      // Apply section-specific classes based on detected section
      let sectionClass = styles.verdictTitle;
      const style = getSectionStyle();

      if (style === "success") {
        sectionClass += ` ${styles.sectionSuccess}`;
      } else if (style === "warning") {
        sectionClass += ` ${styles.sectionWarning}`;
      }

      return (
        <h2 className={sectionClass} data-section={currentSection} {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ node, ...props }) => (
      <h3 className={styles.sectionHeading} {...props} />
    ),
    p: ({ node, ...props }) => {
      const style = getSectionStyle();
      const sectionClass = style === "success" ? styles.inSuccessSection : style === "warning" ? styles.inWarningSection : "";
      return <p className={`${styles.verdictText} ${sectionClass}`} {...props} />;
    },
    strong: ({ node, ...props }) => {
      const style = getSectionStyle();
      const sectionClass = style === "success" ? styles.strongSuccess : style === "warning" ? styles.strongWarning : "";
      return <strong className={`${styles.verdictStrong} ${sectionClass}`} {...props} />;
    },
    ul: ({ node, ...props }) => {
      const style = getSectionStyle();
      const sectionClass = style === "success" ? styles.listSuccess : style === "warning" ? styles.listWarning : "";
      return <ul className={`${styles.verdictList} ${sectionClass}`} {...props} />;
    },
    ol: ({ node, ...props }) => {
      const style = getSectionStyle();
      const sectionClass = style === "success" ? styles.listSuccess : style === "warning" ? styles.listWarning : "";
      return <ol className={`${styles.verdictList} ${sectionClass}`} {...props} />;
    },
    li: ({ node, ...props }) => {
      const style = getSectionStyle();
      const sectionClass = style === "success" ? styles.listItemSuccess : style === "warning" ? styles.listItemWarning : "";
      return <li className={`${styles.verdictListItem} ${sectionClass}`} {...props} />;
    },
    code: ({ node, ...props }) => {
      const style = getSectionStyle();
      const sectionClass = style === "success" ? styles.codeSuccess : style === "warning" ? styles.codeWarning : "";
      return <code className={`${styles.verdictCode} ${sectionClass}`} {...props} />;
    },
  };
};

/**
 * VerdictPanel Component
 * @param {string} verdict - Markdown string with analysis verdict
 * @param {boolean} isCorrective - If true, displays coral/warning color scheme for corrective waves
 * @param {string} className - Optional CSS class names
 *
 * Color Logic:
 * - Motive Waves (isCorrective=false): Validation=primary(teal), Invalidation=secondary(coral)
 * - Corrective Waves (isCorrective=true): Validation=secondary(coral), Invalidation=primary(teal)
 */
export default function VerdictPanel({
  verdict,
  isCorrective = false,
  className = "",
}) {
  const wrapperClass = `${styles.verdictPanelWrapper} ${
    isCorrective ? styles.verdictPanelCorrective : ""
  } ${className}`;

  const markdownComponents = createMarkdownComponents(isCorrective);

  return (
    <div className={wrapperClass}>
      {/* Main content */}
      <div className={styles.verdictContent}>
        <ReactMarkdown components={markdownComponents}>{verdict}</ReactMarkdown>
      </div>

      {/* Footer badge */}
      <div className={styles.verdictFooter}>
        <span className={styles.verdictBadge}>
          {isCorrective ? "⚠️ " : "✓ "}
          Analysis Verdict
        </span>
      </div>
    </div>
  );
}

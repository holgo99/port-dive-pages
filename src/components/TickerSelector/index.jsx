/**
 * TickerSelector Component - REDESIGNED
 *
 * New Layout:
 * - Left: Timeframe badge (interactable dropdown)
 * - Center: Clickable ticker area (icon + name + chevron) opens ticker dropdown
 * - Right: Title/subtitle content
 *
 * Features:
 * - Timeframe dropdown with premium styling
 * - Ticker dropdown with scrollable list
 * - Premium styling with animations
 * - Keyboard accessible
 *
 * @component
 */

import React, { useState, useRef, useEffect } from "react";
import { TickerIcon } from "@site/src/components/TickerIcon";
import { PORTDIVE_THEME } from "@site/src/components/PortDiveTheme";
import { useTickerConfig } from "@site/src/hooks/useTickerConfig";
import styles from "./styles.module.css";

// ============================================================================
// SVG ICONS
// ============================================================================

const ChevronDownIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ClockIcon = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

// ============================================================================
// TIMEFRAME BADGE DROPDOWN COMPONENT
// ============================================================================

const TimeframeBadge = ({
  timeframe,
  timeframeOptions,
  onTimeframeChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSelect = (tf) => {
    onTimeframeChange(tf);
    setIsOpen(false);
  };

  return (
    <div className={styles.timeframeBadge} ref={dropdownRef}>
      <button
        className={`${styles.timeframeButton} ${isOpen ? styles.open : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <ClockIcon size={12} />
        <span className={styles.timeframeValue}>{timeframe}</span>
        <ChevronDownIcon size={12} />
      </button>

      {isOpen && (
        <div className={styles.timeframeMenu} role="listbox">
          {timeframeOptions.map((tf) => (
            <button
              key={tf}
              className={`${styles.timeframeOption} ${
                tf === timeframe ? styles.selected : ""
              }`}
              onClick={() => handleSelect(tf)}
              role="option"
              aria-selected={tf === timeframe}
            >
              {tf}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// TICKER DROPDOWN COMPONENT
// ============================================================================

const TickerDropdown = ({
  ticker,
  tickerName,
  tickerIconUrl,
  availableTickers = [],
  onTickerChange,
  theme,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleSelect = (tickerItem) => {
    onTickerChange(tickerItem.ticker);
    setIsOpen(false);
  };

  const hasMultipleTickers = availableTickers.length > 1;

  return (
    <div className={styles.tickerDropdown} ref={dropdownRef}>
      <button
        className={`${styles.tickerButton} ${isOpen ? styles.open : ""} ${!hasMultipleTickers ? styles.noDropdown : ""}`}
        onClick={() => hasMultipleTickers && setIsOpen(!isOpen)}
        aria-haspopup={hasMultipleTickers ? "listbox" : undefined}
        aria-expanded={hasMultipleTickers ? isOpen : undefined}
        disabled={!hasMultipleTickers}
      >
        <div className={styles.tickerIconWrapper}>
          <TickerIcon
            tickerIconUrl={tickerIconUrl}
            ticker={ticker}
            size={48}
            iconOnly={true}
          />
        </div>
        <div className={styles.tickerTextArea}>
          <span className={styles.tickerSymbol}>{ticker}</span>
          {tickerName && (
            <span className={styles.tickerName}>{tickerName}</span>
          )}
        </div>
        {hasMultipleTickers && (
          <div className={styles.tickerChevron}>
            <ChevronDownIcon size={18} />
          </div>
        )}
      </button>

      {isOpen && hasMultipleTickers && (
        <div className={styles.tickerMenu} role="listbox">
          <div className={styles.tickerMenuScroll}>
            {availableTickers.map((tickerItem) => (
              <button
                key={tickerItem.ticker}
                className={`${styles.tickerOption} ${
                  tickerItem.ticker === ticker ? styles.selected : ""
                }`}
                onClick={() => handleSelect(tickerItem)}
                role="option"
                aria-selected={tickerItem.ticker === ticker}
              >
                <div className={styles.tickerOptionIcon}>
                  <TickerIcon
                    tickerIconUrl={tickerItem.tickerIconUrl}
                    ticker={tickerItem.ticker}
                    size={36}
                    iconOnly={true}
                  />
                </div>
                <div className={styles.tickerOptionText}>
                  <span className={styles.tickerOptionSymbol}>{tickerItem.ticker}</span>
                  {tickerItem.tickerName && (
                    <span className={styles.tickerOptionName}>{tickerItem.tickerName}</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function TickerSelector({
  // Ticker props
  ticker,
  tickerIconUrl: tickerIconUrlProp,
  tickerName: tickerNameProp,
  availableTickers = [],
  onTickerChange,
  // Timeframe props
  timeframe = "1D",
  timeframeOptions = ["1H", "1D", "1W"],
  onTimeframeChange,
  // Content props
  title,
  subtitle,
  theme = PORTDIVE_THEME,
  // Styling
  className = "",
}) {
  // Get config from context (if available)
  const tickerConfig = useTickerConfig();

  // Merge context with props (props take precedence)
  const displayTicker = ticker || tickerConfig.ticker;
  const tickerName = tickerNameProp || tickerConfig.tickerName;
  const tickerIconUrl = tickerIconUrlProp || tickerConfig.tickerIconUrl;

  // If no availableTickers provided, create a single-item array with current ticker
  const tickerList = availableTickers.length > 0
    ? availableTickers
    : [{ ticker: displayTicker, tickerName, tickerIconUrl }];

  return (
    <header className={`${styles.tickerSelector} ${className}`.trim()}>
      {/* Left: Ticker Dropdown Area */}
      <TickerDropdown
        ticker={displayTicker}
        tickerName={tickerName}
        tickerIconUrl={tickerIconUrl}
        availableTickers={tickerList}
        onTickerChange={onTickerChange}
        theme={theme}
      />

      {/* Center: Content section */}
      {(title || subtitle) && (
        <div className={styles.contentSection}>
          {title && <h1 className={styles.title}>{title}</h1>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}

      {/* Right: Timeframe Badge */}
      {onTimeframeChange && (
        <TimeframeBadge
          timeframe={timeframe}
          timeframeOptions={timeframeOptions}
          onTimeframeChange={onTimeframeChange}
        />
      )}
    </header>
  );
}

// Also export as TickerHeader for backwards compatibility
export { TickerSelector as TickerHeader };

export default TickerSelector;

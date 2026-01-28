/**
 * TabsContainer - Tab Navigation Component
 *
 * Provides tabbed interface for switching between analysis dashboards
 * with keyboard navigation support (arrow keys, Home, End)
 *
 * @component
 * @param {Array} tabs - Array of tab objects { id, label }
 * @param {string} activeTab - Currently active tab ID
 * @param {Function} onTabChange - Callback when tab changes
 * @param {ReactNode} children - Tab content
 */

import React from "react";
import styles from "./styles.module.css";

export function TabsContainer({ tabs, activeTab, onTabChange, children }) {
  /**
   * Handle keyboard navigation
   * Arrow Left/Right: Switch tabs
   * Home: First tab
   * End: Last tab
   */
  const handleKeyDown = (e) => {
    const tabIds = tabs.map((t) => t.id);
    const currentIndex = tabIds.indexOf(activeTab);

    let newIndex = currentIndex;

    switch (e.key) {
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : tabIds.length - 1;
        break;
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        newIndex = currentIndex < tabIds.length - 1 ? currentIndex + 1 : 0;
        break;
      case "Home":
        e.preventDefault();
        newIndex = 0;
        break;
      case "End":
        e.preventDefault();
        newIndex = tabIds.length - 1;
        break;
      default:
        return;
    }

    onTabChange(tabIds[newIndex]);
  };

  return (
    <div className={styles.tabsContainer}>
      {/* Tab Navigation */}
      <div className={styles.tabsList} role="tablist" onKeyDown={handleKeyDown}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ""}`}
            onClick={() => onTabChange(tab.id)}
            tabIndex={activeTab === tab.id ? 0 : -1}
          >
            <span className={styles.tabLabel}>{tab.label}</span>
            {activeTab === tab.id && <div className={styles.tabIndicator} />}
          </button>
        ))}
      </div>

      {/* Tab Content Panel */}
      <div
        id={`panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
        className={styles.tabPanel}
      >
        {children}
      </div>
    </div>
  );
}

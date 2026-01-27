// src/hooks/useDataSelector.js
/**
 * Generic selector hook for managing active item state
 * Can be used for any list of items with IDs
 */

import { useState, useCallback, useMemo } from "react";

/**
 * Hook for managing selection state over a list of items
 *
 * @param {Array} items - Array of items with 'id' property
 * @param {string} defaultId - Initial active item ID
 * @returns {Object} - { activeId, activeItem, setActive }
 */
export const useDataSelector = (items, defaultId) => {
  const [activeId, setActiveId] = useState(defaultId);

  const activeItem = useMemo(() => {
    return items?.find((item) => item.id === activeId) || null;
  }, [items, activeId]);

  const setActive = useCallback((newId) => {
    setActiveId(newId);
  }, []);

  return {
    activeId,
    activeItem,
    items,
    setActive,
  };
};

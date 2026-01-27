// src/hooks/useDataSelector.js
/**
 * Generic Context-based selector hook
 * Reusable for any data structure
 */

import {
  useState,
  useCallback,
  useMemo,
  createContext,
  useContext,
} from "react";

const DataSelectorContext = createContext(null);

/**
 * Provider component - wraps child components with selector state
 */
export const DataSelectorProvider = ({
  items,
  defaultActiveId,
  onActiveChange,
  children,
}) => {
  const [activeId, setActiveId] = useState(defaultActiveId);

  const handleChangeActive = useCallback(
    (newId) => {
      setActiveId(newId);
      onActiveChange?.(newId);
    },
    [onActiveChange],
  );

  // Support both Array and Object formats
  const itemsArray = Array.isArray(items) ? items : Object.values(items);
  const itemsObject = Array.isArray(items)
    ? items.reduce((acc, item) => ({ ...acc, [item.id]: item }), {})
    : items;

  // Get active item
  const activeItem = useMemo(() => {
    if (Array.isArray(items)) {
      return itemsArray.find((item) => item.id === activeId);
    }
    return itemsObject[activeId] || null;
  }, [activeId, items, itemsArray, itemsObject]);

  const value = {
    activeId,
    activeItem,
    items: itemsArray,
    itemsObject,
    setActive: handleChangeActive,
  };

  return (
    <DataSelectorContext.Provider value={value}>
      {children}
    </DataSelectorContext.Provider>
  );
};

/**
 * Hook to access selector state
 */
export const useDataSelector = () => {
  const context = useContext(DataSelectorContext);

  if (!context) {
    throw new Error("useDataSelector must be used within DataSelectorProvider");
  }

  return context;
};

export { DataSelectorContext };

import React, { createContext, useState, useContext } from 'react';

const BadgeContext = createContext();

export const BadgeProvider = ({ children }) => {
  const [activeStatusCount, setActiveStatusCount] = useState(0);

  const updateActiveStatusCount = (count) => {
    setActiveStatusCount(count);
  };

  return (
    <BadgeContext.Provider value={{ activeStatusCount, updateActiveStatusCount }}>
      {children}
    </BadgeContext.Provider>
  );
};

export const useBadge = () => useContext(BadgeContext);
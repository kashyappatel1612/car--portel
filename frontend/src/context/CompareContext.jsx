import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [selectedCars, setSelectedCars] = useState(() => {
    try {
      const saved = localStorage.getItem('autosmart_compare');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('autosmart_compare', JSON.stringify(selectedCars));
    } catch (e) {}
  }, [selectedCars]);

  const addToCompare = (car) => {
    if (!car || !car._id) return { success: false, reason: 'Invalid car' };
    if (selectedCars.some((c) => c._id === car._id)) {
      return { success: false, reason: 'Car is already in compare list' };
    }
    if (selectedCars.length >= 4) {
      return { success: false, reason: 'Maximum 4 cars can be compared at once' };
    }
    setSelectedCars((prev) => [...prev, car]);
    return { success: true };
  };

  const removeFromCompare = (carId) => {
    setSelectedCars((prev) => prev.filter((c) => c._id !== carId));
  };

  const clearCompare = () => {
    setSelectedCars([]);
  };

  const isInCompare = (carId) => selectedCars.some((c) => c._id === carId);

  return (
    <CompareContext.Provider
      value={{
        selectedCars,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        count: selectedCars.length,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);

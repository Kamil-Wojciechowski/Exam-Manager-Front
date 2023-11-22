// src/config.js
import { createContext, useContext } from 'react';

const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  const baseUrl = 'http://localhost:8080/api/v1';

  return (
    <ConfigContext.Provider value={{ baseUrl }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

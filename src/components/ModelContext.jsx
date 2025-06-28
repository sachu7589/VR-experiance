import { createContext, useContext, useState } from 'react';

const ModelContext = createContext();

export function useModel() {
  return useContext(ModelContext);
}

export function ModelProvider({ children }) {
  const [modelFile, setModelFile] = useState(null);
  return (
    <ModelContext.Provider value={{ modelFile, setModelFile }}>
      {children}
    </ModelContext.Provider>
  );
} 
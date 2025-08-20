import { useState } from 'react';
import { Atom } from 'react-loading-indicators';

// Default settings
const DEFAULT_SETTINGS = {
  text: 'Hang Tight',
  color: '#11B3AE',
  size: 'large',
  textColor: '#E9D8C8'
};

export const useSimpleLoading = (settings = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Merge custom settings with defaults
  const finalSettings = { ...DEFAULT_SETTINGS, ...settings };

  const loading = (show) => {
    setIsLoading(show);
  };

  const LoadingComponent = () => {
    if (!isLoading) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="text-center">
          <Atom 
            color={finalSettings.color} 
            size={finalSettings.size} 
            text={finalSettings.text} 
            textColor={finalSettings.textColor} 
          />
        </div>
      </div>
    );
  };

  return {
    loading,
    isLoading,
    LoadingComponent
  };
}; 
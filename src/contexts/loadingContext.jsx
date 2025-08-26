import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import LoadingTradeMesh from '../components/LoadingTradeMesh';

const LoadingContext = createContext();

// Default settings - simplified for TradeMesh loader
const DEFAULT_SETTINGS = {
  text: '',
  color: '#17b9bd',
  size: 'small',
  textColor: '#17b9bd'
};

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});

  const showLoading = useCallback((key = 'default', options = {}) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: {
        isLoading: true,
        text: options.text || DEFAULT_SETTINGS.text,
        color: options.color || DEFAULT_SETTINGS.color,
        size: options.size || DEFAULT_SETTINGS.size,
        textColor: options.textColor || DEFAULT_SETTINGS.textColor
      }
    }));
  }, []);

  const hideLoading = useCallback((key = 'default') => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        isLoading: false
      }
    }));
  }, []);

  const setLoadingText = useCallback((key = 'default', text) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        text
      }
    }));
  }, []);

  // Simple loading function that takes a boolean
  const loading = useCallback((show, key = 'default', options = {}) => {
    if (show) {
      showLoading(key, options);
    } else {
      hideLoading(key);
    }
  }, [showLoading, hideLoading]);

  const LoadingOverlay = useCallback(({ key = 'default', children }) => {
    const loadingState = loadingStates[key];
    
    if (!loadingState?.isLoading) {
      return children;
    }

    return (
      <div className="relative">
        {children}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-center">
            <LoadingTradeMesh loading={loadingState.isLoading} />
          </div>
        </div>
      </div>
    );
  }, [loadingStates]);

  const LoadingSpinner = useCallback(({ key = 'default' }) => {
    const loadingState = loadingStates[key];
    
    if (!loadingState?.isLoading) {
      return null;
    }

    return (
      <div className="flex items-center justify-center p-4">
        <LoadingTradeMesh loading={loadingState.isLoading} />
      </div>
    );
  }, [loadingStates]);

  // Global loading component for simple usage
  const GlobalLoading = useCallback(() => {
    const defaultLoading = loadingStates['default'];
    
    if (!defaultLoading?.isLoading) {
      return null;
    }

    return (
      <LoadingTradeMesh loading={defaultLoading.isLoading} />
    );
  }, [loadingStates]);

  const isLoading = useCallback((key = 'default') => loadingStates[key]?.isLoading || false, [loadingStates]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    loadingStates,
    showLoading,
    hideLoading,
    setLoadingText,
    loading, // Simple boolean function
    LoadingOverlay,
    LoadingSpinner,
    GlobalLoading, // Global loading component
    isLoading
  }), [loadingStates, showLoading, hideLoading, setLoadingText, loading, LoadingOverlay, LoadingSpinner, GlobalLoading, isLoading]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <GlobalLoading />
    </LoadingContext.Provider>
  );
};
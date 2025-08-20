import React from 'react';
import { useSimpleLoading } from '../hooks/useSimpleLoading';

const SimpleLoadingExample = () => {
  // Default settings
  const { loading, LoadingComponent } = useSimpleLoading();
  
  // Custom settings
  const { loading: customLoading, LoadingComponent: CustomLoadingComponent } = useSimpleLoading({
    text: 'Processing...',
    color: '#FF6B6B',
    size: 'medium'
  });

  const handleDefaultLoading = async () => {
    loading(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    loading(false);
  };

  const handleCustomLoading = async () => {
    customLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    customLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-[#E9D8C8] mb-4">Simple Loading Hook Examples</h2>
      
      {/* Default Loading */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-[#E9D8C8]">Default Loading</h3>
        <button 
          onClick={handleDefaultLoading}
          className="px-4 py-2 bg-[#11B3AE] text-white rounded-lg hover:bg-[#0F9A95] transition-colors"
        >
          Show Default Loading
        </button>
        <LoadingComponent />
      </div>

      {/* Custom Loading */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-[#E9D8C8]">Custom Loading</h3>
        <button 
          onClick={handleCustomLoading}
          className="px-4 py-2 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#FF5252] transition-colors"
        >
          Show Custom Loading
        </button>
        <CustomLoadingComponent />
      </div>

      {/* API Call Example */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-[#E9D8C8]">API Call Example</h3>
        <button 
          onClick={async () => {
            loading(true);
            try {
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 1500));
              console.log('API call completed');
            } catch (error) {
              console.error('API call failed:', error);
            } finally {
              loading(false);
            }
          }}
          className="px-4 py-2 bg-[#11B3AE] text-white rounded-lg hover:bg-[#0F9A95] transition-colors"
        >
          Simulate API Call
        </button>
      </div>
    </div>
  );
};

export default SimpleLoadingExample; 
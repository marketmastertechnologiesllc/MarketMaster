import React from 'react';
import { Icon } from '@iconify/react';
import usePromotion from '../../hooks/usePromotion';
import useAuth from '../../hooks/useAuth';

function PromotionModal() {
  const { isAuthenticated } = useAuth();
  const { 
    isModalVisible, 
    currentTitle, 
    currentContent, 
    hidePromotionModal, 
    isLoading,
    nextPromotion,
    currentPromotionIndex,
    totalPromotions
  } = usePromotion();

  // Don't show modal for non-authenticated users
  if (!isAuthenticated || !isModalVisible || !currentTitle || !currentContent) {
    return null;
  }

  return (
    <div className="fixed right-0 bottom-0 top-0 left-0 flex items-center justify-center z-[1201]">
      {/* Backdrop - clicking outside doesn't close the modal */}
      <div className="fixed right-0 bottom-0 top-0 left-0 flex items-center justify-center z-[1202] bg-opacity-80 bg-[#1D2127]"></div>
      
      {/* Modal Content */}
      <section className="mb-[20px] rounded bg-[#282D36] w-[500px] z-[100000] animate-fade-in">
        <header className="p-[18px] text-white flex justify-between items-center border-b border-[#1d2127]">
          <h2 className="mt-[5px] text-[20px] font-normal flex items-center">
            <Icon 
              icon="mdi:gift-outline" 
              width="24" 
              height="24" 
              className="mr-2 text-[#11B3AE]"
            />
            Special Promotion
          </h2>
          <button
            className="bg-[#0099e6] hover:bg-[#0077cc] w-[33px] h-[33px] rounded font-extrabold transition-colors duration-200 flex items-center justify-center"
            onClick={hidePromotionModal}
            aria-label="Close promotion modal"
          >
            ✖
          </button>
        </header>
        
        <div className="p-[20px] bg-[#2E353E]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#11B3AE]"></div>
              <span className="ml-3 text-[#ccc]">Loading promotion...</span>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-4">
                <Icon 
                  icon="mdi:star" 
                  width="32" 
                  height="32" 
                  className="text-[#11B3AE] mx-auto mb-2"
                />
              </div>
              
              <h3 className="text-[#E9D8C8] text-lg font-medium mb-4 leading-relaxed">
                {currentTitle}
              </h3>
              
              <div className="bg-[#1D2127] rounded-lg p-4 mb-4">
                <div 
                  className="text-[#ccc] text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: currentContent }}
                />
              </div>
              
              {/* Progress indicator */}
              {totalPromotions > 1 && (
                <div className="mb-4">
                  <div className="flex justify-center space-x-1">
                    {Array.from({ length: totalPromotions }, (_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                          index === currentPromotionIndex 
                            ? 'bg-[#11B3AE]' 
                            : 'bg-[#4A5568]'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[#888] text-xs mt-1">
                    {currentPromotionIndex + 1} of {totalPromotions}
                  </p>
                </div>
              )}
              
              <div className="flex justify-center space-x-3">
                <button
                  className="bg-[#11B3AE] hover:bg-[#0F9A95] text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                  onClick={nextPromotion}
                >
                  {totalPromotions > 1 ? 'Next' : 'Close'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default PromotionModal; 
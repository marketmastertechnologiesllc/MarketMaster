import { useContext } from 'react';
import { PromotionContext } from '../contexts/promotionContext';

const usePromotion = () => {
  const context = useContext(PromotionContext);

  if (!context) {
    throw new Error('usePromotion must be used within a PromotionProvider');
  }

  return context;
};

export default usePromotion; 
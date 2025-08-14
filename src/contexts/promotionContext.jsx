import { createContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import useAuth from '../hooks/useAuth';

const PromotionContext = createContext();

function PromotionProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const [titles, setTitles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasShownOnSignIn, setHasShownOnSignIn] = useState(false);
  const [currentPromotionIndex, setCurrentPromotionIndex] = useState(0);
  const [promotions, setPromotions] = useState([]);

  // Fetch homepage titles and content from API
  const fetchTitlesAndContent = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/settings/homepage-content/titles');
      const fetchedTitles = res.data || [];
      setTitles(fetchedTitles);
      
      // If we have titles, fetch content for all titles
      if (fetchedTitles.length > 0 && !hasShownOnSignIn) {
        const allPromotions = [];
        
        for (const title of fetchedTitles) {
          try {
            let contentRes;
            try {
              contentRes = await api.get(`/settings/homepage-content/title/${encodeURIComponent(title)}`);
            } catch (err) {
              contentRes = await api.get(`/settings/homepage-content?title=${encodeURIComponent(title)}`);
            }
            
            const contentData = contentRes.data;
            
            if (contentData && contentData.content && contentData.content.trim() !== '') {
              allPromotions.push({
                title: contentData.title || title,
                content: contentData.content,
                createdAt: contentData.createdAt || contentData.created_at || contentData.date,
                id: contentData.id,
                order: contentData.order || contentData.sequence || contentData.priority
              });
            }
          } catch (contentErr) {
            console.error('Failed to fetch content for title:', title, contentErr);
          }
        }
        
        // Sort promotions chronologically (earliest to latest)
        const sortedPromotions = allPromotions.sort((a, b) => {
          // If there's a createdAt field, use it for sorting
          if (a.createdAt && b.createdAt) {
            return new Date(a.createdAt) - new Date(b.createdAt);
          }
          // If there's an id field that represents order, use it
          if (a.id && b.id) {
            return a.id - b.id;
          }
          // If there's an order field, use it
          if (a.order && b.order) {
            return a.order - b.order;
          }
          // Default: keep original order (assuming titles array is already in chronological order)
          return 0;
        });
        
        setPromotions(sortedPromotions);
        
        // Show first promotion if we have any
        if (sortedPromotions.length > 0) {
          setTimeout(() => {
            setCurrentTitle(sortedPromotions[0].title);
            setCurrentContent(sortedPromotions[0].content);
            setCurrentPromotionIndex(0);
            setIsModalVisible(true);
            setHasShownOnSignIn(true);
          }, 1000); // 1 second delay to ensure sign-in is fully completed
        }
      }
      
    } catch (err) {
      console.error('Failed to fetch promotion titles:', err);
      setTitles([]);
    } finally {
      setIsLoading(false);
    }
  }, [hasShownOnSignIn]);

  // Show next promotion
  const nextPromotion = useCallback(() => {
    if (promotions.length > 0) {
      const nextIndex = (currentPromotionIndex + 1) % promotions.length;
      setCurrentPromotionIndex(nextIndex);
      setCurrentTitle(promotions[nextIndex].title);
      setCurrentContent(promotions[nextIndex].content);
    }
  }, [promotions, currentPromotionIndex]);

  // Show modal with random title and content (keeping for backward compatibility)
  const showPromotionModal = useCallback(async () => {
    if (titles.length > 0) {
      const randomTitle = titles[Math.floor(Math.random() * titles.length)];
      
      try {
        let contentRes;
        try {
          contentRes = await api.get(`/settings/homepage-content/title/${encodeURIComponent(randomTitle)}`);
        } catch (err) {
          contentRes = await api.get(`/settings/homepage-content?title=${encodeURIComponent(randomTitle)}`);
        }
        
        const contentData = contentRes.data;
        
        if (contentData && contentData.content && contentData.content.trim() !== '') {
          setCurrentTitle(contentData.title || randomTitle);
          setCurrentContent(contentData.content);
          setIsModalVisible(true);
        }
      } catch (err) {
        console.error('Failed to fetch content for manual modal show:', err);
      }
    }
  }, [titles]);

  // Hide modal
  const hidePromotionModal = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  // Initialize and set up interval - only for authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      fetchTitlesAndContent();
    }
  }, [fetchTitlesAndContent, isAuthenticated]);

  // Reset hasShownOnSignIn when user signs out
  useEffect(() => {
    if (!isAuthenticated) {
      setHasShownOnSignIn(false);
      setIsModalVisible(false);
      setCurrentPromotionIndex(0);
      setPromotions([]);
    }
  }, [isAuthenticated]);

  const value = {
    isModalVisible,
    currentTitle,
    currentContent,
    titles,
    isLoading,
    showPromotionModal,
    hidePromotionModal,
    fetchTitlesAndContent,
    nextPromotion,
    currentPromotionIndex,
    promotions,
    totalPromotions: promotions.length
  };

  return (
    <PromotionContext.Provider value={value}>
      {children}
    </PromotionContext.Provider>
  );
};
export { PromotionContext, PromotionProvider }; 

import { useEffect, useState } from 'react';

import './App.css';
import CoreRoutes from './routes';
import ToastProvider from './contexts/toastContext';
import AuthProvider from './contexts/authContext';
import UtilsProvider from './contexts/utilsContext';
import SocketProvider from './contexts/socketContext';
import { PromotionProvider } from './contexts/promotionContext';
import { LoadingProvider } from './contexts/loadingContext';
import PromotionModal from './components/modals/PromotionModal';
import LoadingTradeMesh from './components/LoadingTradeMesh';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 3000);
  }, []);

  // Show initial loading screen
  if (loading) {
    return <LoadingTradeMesh loading={loading} />;
  }

  // Main app with all providers
  return (
    <ToastProvider>
      <AuthProvider>
        <UtilsProvider>
          <SocketProvider>
            <PromotionProvider>
              <LoadingProvider>
                <CoreRoutes />
                <PromotionModal />
              </LoadingProvider>
            </PromotionProvider>
          </SocketProvider>
        </UtilsProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;

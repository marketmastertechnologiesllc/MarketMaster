import { createContext, useMemo } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { jwtDecode } from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';
import { useNavigate, useLocation } from 'react-router-dom';

export const AuthContext = createContext({
  isAuthenticated: false,
  isInitialized: false,
  user: {},
  signOut: () => {},
});

const verifyToken = (token) => {
  if (!token) {
    return false;
  }
  const decoded = jwtDecode(token);

  /**
   * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
   */
  return decoded.exp > Date.now() / 1000;
};

// eslint-disable-next-line react/display-name, react/prop-types
const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  const { pathname } = useLocation();

  // Define public routes that don't require authentication
  const publicRoutes = [
    '/reset-password',
    '/forgot-password', 
    '/auth/login', 
    '/auth/signup', 
    '/auth/verify-email',
    '/email-verification-page-for-login',
    '/email-verification-page-for-signup',
    '/email-verification-page-for-update',
    '/auth/verify-email-update'
  ];

  const init = useCallback(async () => {
    try {
      const token = window.localStorage.getItem('token');

      // Check if current path is a public route
      const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
      
      if (isPublicRoute) {
        // Don't redirect for public routes, just mark as initialized
        setIsInitialized(true);
        return;
      }

      if (token && verifyToken(token)) {
        // setSession(token);
        setAuthToken(token);
        const response = await api.get('/users/me');
        const user = response.data;
        setUser(user);
        setIsAuthenticated(true);
      } else {
        if (token) {
          localStorage.setItem('expired', true);
        }
        setIsAuthenticated(false);
        setUser({});
        navigate('/auth/login');
      }
    } catch (err) {
      console.log(err);
      console.error(err);
    } finally {
      setIsInitialized(true);
    }
  }, [pathname, navigate, publicRoutes]);

  useEffect(() => {
    if (pathname.substring(0, 11) !== '/auth/view/') {
      init();
    }
  }, [init]);

  const signOut = useCallback(() => {
    setIsAuthenticated(false);
    setUser({});
    setAuthToken();

    navigate('/auth/login');
  }, [navigate]);

  const login = useCallback((data) =>
    new Promise((resolve, reject) => {
      api
        .post('/users/login', data)
        .then((res) => {
          if (!res.data.token) {
            navigate('/email-verification-page-for-login');
          } else {
            setAuthToken(res.data.token);
            setUser(res.data.user);
            setIsAuthenticated(true);
            resolve();
          }
        })
        .catch((err) => reject(err));
    }), [navigate]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    isAuthenticated,
    user,
    login,
    signOut,
    isInitialized
  }), [isAuthenticated, user, login, signOut, isInitialized]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

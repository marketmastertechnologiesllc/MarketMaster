import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  baseURL: 'https://marketmasterapi.marketmaster.com/api',
  // baseURL: 'https://tradecopiersignalsbackend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

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

/*
  NOTE: intercept any error responses from the api
 and check if the token is no longer valid.
 ie. Token has expired or user is no longer
 authenticated.
 logout the user if the token has expired
*/

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status === 401) {
      const currentPath = window.location.pathname;
      const isPublicRoute = publicRoutes.some(route => currentPath.startsWith(route));
      
      if (localStorage.getItem('token')) {
        localStorage.setItem('expired', true);
        console.log('expired3');
      }

      window.localStorage.removeItem('token');

      // Only redirect to login if it's not a public route and we have a token
      if (!isPublicRoute && localStorage.getItem('token')) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;

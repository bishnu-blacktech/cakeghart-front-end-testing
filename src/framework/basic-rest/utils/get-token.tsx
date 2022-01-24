import Cookies from 'js-cookie';

export const getToken = () => {
  if (typeof window === undefined || typeof window === 'undefined') {
    return null;
  }

  if (sessionStorage.getItem('auth_token')) {
    return sessionStorage.getItem('auth_token');
  }
  return Cookies.get('auth_token');
};

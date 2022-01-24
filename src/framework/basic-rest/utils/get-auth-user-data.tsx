import Cookies from 'js-cookie';

export function getAuthUser() {
  if (typeof window === undefined || typeof window === 'undefined') {
    return null;
  }

  let authUser: any = null;

  if (sessionStorage.getItem('auth_user')) {
    authUser = sessionStorage.getItem('auth_user');
  } else if (Cookies.get('auth_user')) {
    authUser = Cookies.get('auth_user');
  }

  if (authUser === null) {
    return null;
  }

  try {
    return JSON.parse(authUser);
  } catch {
    return null;
  }
}

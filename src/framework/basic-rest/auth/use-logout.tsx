import { useUI } from '@contexts/ui.context';
import { ROUTES } from '@utils/routes';
import Cookies from 'js-cookie';
import Router from 'next/router';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

export interface LoginInputType {
  email: string;
  password: string;
  remember_me: boolean;
}

async function logout() {
  return {
    ok: true,
    message: 'Logout Successful!',
  };
}

export const useLogoutMutation = () => {
  const { unauthorize } = useUI();
  return useMutation(() => logout(), {
    onSuccess: (_data) => {
      Cookies.remove('auth_token');
      Cookies.remove('auth_user');
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_user');
      unauthorize();
      Router.push(ROUTES.HOME);
    },
    onError: (data) => {
      toast.error('Something went wrong. Please try again later.');
    },
  });
};

import { useModalAction } from '@components/common/modal/modal.context';
import { useUI } from '@contexts/ui.context';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import server from '@framework/utils/server';
import Cookies from 'js-cookie';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

export interface LoginInputType {
  email: string;
  password: string;
  remember: boolean;
}

async function login(input: LoginInputType) {
  const response = await server.post(API_ENDPOINTS.LOGIN, input);
  return {
    token: response.data.token,
    user: response.data.user,
    rememberMe: input.remember,
  };
}

export const useLoginMutation = () => {
  const { authorize } = useUI();
  const { closeModal } = useModalAction();

  return useMutation((input: LoginInputType) => login(input), {
    onSuccess: (data) => {
      if (data.rememberMe) {
        Cookies.set('auth_token', data.token);
        Cookies.set('auth_user', JSON.stringify(data.user));
      } else {
        sessionStorage.setItem('auth_token', data.token);
        sessionStorage.setItem('auth_user', JSON.stringify(data.user));
      }
      authorize();
      closeModal();
      toast.success('Successfully logined.');
    },
    onError: (data: any) => {
      if (data.response.data.errors) {
        toast.error(data.response.data.errors);
        return;
      }
      toast.error('Someting went wrong. Please try again later.');
    },
  });
};

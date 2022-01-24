import { useModalAction } from '@components/common/modal/modal.context';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import server from '@framework/utils/server';
import Cookies from 'js-cookie';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

export interface ForgetPasswordType {
  email: string;
}

async function forgetPassword(input: ForgetPasswordType) {
  const response = await server.patch(API_ENDPOINTS.FORGET_PASSWORD, input);
  return response.data;
}

export const useForgetPasswordMutation = () => {
  const { closeModal } = useModalAction();
  return useMutation((input: ForgetPasswordType) => forgetPassword(input), {
    onSuccess: (data) => {
      Cookies.remove('auth_token');
      Cookies.remove('auth_user');
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_user');
      toast.success(data);
      closeModal();
    },
    onError: (data: any) => {
      if (data.response.data.error) {
        toast.error(data.response.data.error);
        return;
      }

      toast.error('Something went wrong, Please try again later.');
    },
  });
};

import { useUI } from '@contexts/ui.context';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { getAuthUser } from '@framework/utils/get-auth-user-data';
import server from '@framework/utils/server';
import { useMutation } from 'react-query';
import Cookies from 'js-cookie';
import Router from 'next/router';
import { toast } from 'react-toastify';
import { ROUTES } from '@utils/routes';

export interface ChangePasswordInputType {
  newPassword: string;
  oldPassword: string;
}

async function changePassword(input: ChangePasswordInputType) {
  const authUser = getAuthUser();
  const response = await server.patch(
    `${API_ENDPOINTS.CHANGE_PASSWORD}${authUser._id}`,
    input
  );
  return response.data;
}

export const useChangePasswordMutation = () => {
  const { unauthorize } = useUI();
  return useMutation(
    (input: ChangePasswordInputType) => changePassword(input),
    {
      onSuccess: (data) => {
        Cookies.remove('auth_token');
        Cookies.remove('auth_user');
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_user');
        unauthorize();
        Router.push(ROUTES.HOME);
        toast.success('Password is successfully updated. Please login again.');
      },
      onError: (data: any) => {
        if (data.response.data.errors) {
          toast.error(data.response.data.errors);
          return;
        }
        toast.error('Something went wrong. Please try again later.');
      },
    }
  );
};

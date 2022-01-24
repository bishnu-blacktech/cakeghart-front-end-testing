import server from '@framework/utils/server';
import { useMutation } from 'react-query';
import { useModalAction } from '@components/common/modal/modal.context';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { toast } from 'react-toastify';

interface ResetPasswordType {
  password: string;
  token: string;
}
export const resetPassword = async (data: ResetPasswordType) => {
  const response = await server.patch(
    `${API_ENDPOINTS.RESET_PASSWORD}${data.token}`,
    { newPassword: data.password }
  );

  return response.data;
};

export const useResetPasswordMutation = () => {
  const { openModal } = useModalAction();
  return useMutation((input: ResetPasswordType) => resetPassword(input), {
    onSuccess: (data: any) => {
      toast.success(data.message);
      openModal('LOGIN_VIEW');
    },
    onError: (data: any) => {
      if (data.response.data.error) {
        toast.error(data.response.data.error);
        return;
      }
      toast.error('Something went wrong. Please try again later.');
    },
  });
};

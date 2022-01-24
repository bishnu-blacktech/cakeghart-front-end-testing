import { useModalAction } from '@components/common/modal/modal.context';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import server from '@framework/utils/server';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

export interface SignUpInputType {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

async function signUp(input: SignUpInputType) {
  const response = await server.post(API_ENDPOINTS.REGISTER, input);
  return response.data;
}

export const useSignUpMutation = () => {
  const { closeModal, openModal } = useModalAction();
  return useMutation((input: SignUpInputType) => signUp(input), {
    onSuccess: (data) => {
      toast.success(data.message);
      closeModal();
      openModal('LOGIN_VIEW');
    },
    onError: (data: any) => {
      if (data.response.data.message) {
        toast.error(data.response.data.message);
        return;
      }
      if (data.response.data.errors) {
        toast.error(data.response.data.errors);
        return;
      }
      toast.error('Something went wrong. Please try again later.');
    },
  });
};

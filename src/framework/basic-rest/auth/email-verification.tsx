import server from '@framework/utils/server';
import { useMutation } from 'react-query';
import { useModalAction } from '@components/common/modal/modal.context';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { ROUTES } from '@utils/routes';

export const verifyEmail = async (link: string) => {
  const response = await server.post(
    `${API_ENDPOINTS.EMAIL_VERIFICATION}${link}`
  );
  return response.data;
};

export const useVerifyEmailMutation = () => {
  const { openModal } = useModalAction();
  const router = useRouter();
  return useMutation((input: string) => verifyEmail(input), {
    onSuccess: () => {
      toast.success('You are verified.');
      openModal('LOGIN_VIEW');
    },
    onError: () => {
      const redirect = () => {
        router.push(ROUTES.HOME);
      };
      toast.error('Invalid verification link.');
      setTimeout(redirect, 3000);
    },
  });
};

import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { getAuthUser } from '@framework/utils/get-auth-user-data';
import server from '@framework/utils/server';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

export interface UpdateUserType {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: string;
  dob: Date;
  email: string;
  password: string;
  confirmPassword: string;

  displayName: string;
  shareProfileData: boolean;
  setAdsPerformance: boolean;
}

export interface UserType {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender: string;
  dob: string;
}

async function updateUser(input: UserType) {
  const authUser: any = getAuthUser();
  const response = await server.patch(
    `${API_ENDPOINTS.UPDATE_USER}${authUser._id}`,
    { user: input }
  );
  return response.data;
}

export const useUpdateUserMutation = () => {
  return useMutation((input: UserType) => updateUser(input), {
    onSuccess: (data) => {
      toast.success('Successfully updated.');
    },
    onError: (data: any) => {
      if (data.response.data.errors) {
        toast.error(data.response.data.errors);
        return;
      }
      toast.error('Something went wrong. Please try again later.');
    },
  });
};

import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { getAuthUser } from '@framework/utils/get-auth-user-data';
import server from '@framework/utils/server';
import { useQuery } from 'react-query';

export interface UserType {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender: string;
  dob: string;
}

const fetchUser = async (authUserId: string | number) => {
  const response = await server.get(`${API_ENDPOINTS.USER}${authUserId}`);
  const userData: UserType = {
    firstName: response.data.firstName,
    lastName: response.data.lastName,
    email: response.data.email,
    phone: response.data.phone,
    gender: response.data.gender,
    dob: response.data.dob,
  };
  return userData;
};

const useUserQuery = (isEnabled?: boolean) => {
  const authUser: any = getAuthUser();
  return useQuery<UserType>('userData', () => fetchUser(authUser._id), {
    enabled: isEnabled ? isEnabled : true,
  });
};

export { useUserQuery, fetchUser };

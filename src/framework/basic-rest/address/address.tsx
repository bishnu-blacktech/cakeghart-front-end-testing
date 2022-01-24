import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import { getAuthUser } from '@framework/utils/get-auth-user-data';
import server from '@framework/utils/server';

export interface AddressType {
  title: string;
  description: string;
}

const fetchAddress = async () => {
  const authUser = getAuthUser();
  if (authUser && authUser._id) {
    const response = await server.get(
      `${API_ENDPOINTS.ADDRESS}${authUser._id}`
    );
    return response.data;
  }

  // If the user is non-verified.

  return [];
};

const useAddressQuery = (isEnabled?: boolean) => {
  return useQuery<AddressType[]>([API_ENDPOINTS.ADDRESS], fetchAddress, {
    enabled: isEnabled ? isEnabled : true,
  });
};

export { useAddressQuery, fetchAddress };

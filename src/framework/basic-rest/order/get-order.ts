import { IOrderType } from '@framework/types';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import server from '@framework/utils/server';

export const fetchOrder = async (_id: string) => {
  const { data } = await server.get(`${API_ENDPOINTS.ORDER}${_id}`);
  return data;
};
export const useOrderQuery = (id: string) => {
  return useQuery<IOrderType, Error>([API_ENDPOINTS.ORDER, id], () =>
    fetchOrder(id)
  );
};

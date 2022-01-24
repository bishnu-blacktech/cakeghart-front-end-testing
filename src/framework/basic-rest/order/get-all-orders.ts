import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import server from '@framework/utils/server';
import { IOrderType } from '@framework/types';

const fetchOrders = async () => {
  const response = await server.get(API_ENDPOINTS.ORDERS);
  return response.data.reverse();
};

const useOrdersQuery = () => {
  return useQuery<IOrderType[]>([API_ENDPOINTS.ORDERS], fetchOrders);
};

export { useOrdersQuery, fetchOrders };

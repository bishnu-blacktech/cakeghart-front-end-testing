import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import server from '@framework/utils/server';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

export const cancelOrder = async (id: string | number) => {
  const response = await server.put(`${API_ENDPOINTS.ORDER}${id}/cancel`);
  return response.data;
};

export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation((id: string | number) => cancelOrder(id), {
    onSuccess: (data) => {
      queryClient.invalidateQueries([API_ENDPOINTS.ORDERS]);
      toast.success('Order is successfully deleted.');
    },
    onError: (data: any) => {
      if (data.response.data.message) {
        toast.error(data.response.data.message);
        return;
      }

      toast.error('Someting went wrong. Please try again later.');
    },
  });
};

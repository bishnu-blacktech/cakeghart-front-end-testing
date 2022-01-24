import { useModalAction } from '@components/common/modal/modal.context';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import server from '@framework/utils/server';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

export interface AddressType {
  title: string;
  description: string;
}

export type FunctionType = 'ADD' | 'EDIT' | 'DELETE';

async function addNewAddress(input: AddressType[]) {
  const response = await server.patch(API_ENDPOINTS.ADDRESS, input);
  return response.data;
}

export function useAddAddressMutation(functionType: FunctionType) {
  const queryClient = useQueryClient();
  const { closeModal } = useModalAction();
  return useMutation((input: AddressType[]) => addNewAddress(input), {
    onSuccess: (data) => {
      queryClient.invalidateQueries([API_ENDPOINTS.ADDRESS]);
      if (functionType === 'ADD') toast.success('Successfully added.');
      if (functionType === 'EDIT') toast.success('Successfully updated.');
      if (functionType === 'DELETE') toast.success('Successfully deleted.');
      closeModal();
    },
    onError: (data: any) => {
      if (data.response.data.error) {
        toast.error(data.response.data.error);
        return;
      }

      if (data.response.data.errors) {
        toast.error(data.response.data.errors);
        return;
      }

      if (data.response.data.message) {
        toast.error(data.response.data.message);
        return;
      }

      toast.error('Something went wrong. Please try again later.');
    },
  });
}

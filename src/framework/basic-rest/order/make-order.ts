import { useCart } from '@contexts/cart/cart.context';
import { useUI } from '@contexts/ui.context';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import server from '@framework/utils/server';
import { ROUTES } from '@utils/routes';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

export interface IUsernameType {
  first: string;
  last: string;
}

export interface ICheckOutItemType {
  itemId: string | number;
  quantity: number;
  variationId?: string | number;
}

export interface IAddCheckOutType {
  name: IUsernameType;
  phone: string;
  location: string;
  email: string;
  date: string;
  time: string;
  items: ICheckOutItemType[];
  notice: string;
}

export const makeOrder = async (input: IAddCheckOutType) => {
  const response = await server.post(API_ENDPOINTS.ORDER, input);
  return response.data;
};

export const useOrderMutation = (setIsLoading?: Function) => {
  const { resetCart } = useCart();
  const router = useRouter();
  const { isAuthorized } = useUI();

  return useMutation((input: IAddCheckOutType) => makeOrder(input), {
    onSuccess: (data) => {
      resetCart();
      toast.success('Your order is successful.');
      if (isAuthorized) router.push(ROUTES.ORDERS);
      else router.push(ROUTES.HOME);
    },
    onError: (data: any) => {
      setIsLoading && setIsLoading(false);
      if (data.response.data.message) {
        toast.error(data.response.data.message);
        return;
      }
      toast.error('Someting went wrong. Please try again later.');
    },
  });
};

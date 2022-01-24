import { IProductType } from '@framework/types';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import server from '@framework/utils/server';

export const fetchAllProducts = async () => {
  const response = await server.get(API_ENDPOINTS.PRODUCTS);

  const data = [...response.data].map((dt) => {
    const imageData: string[] = dt.images.map((img: string) => {
      return `${process.env.NEXT_PUBLIC_IMAGE_API_ENDPOINT}${img}`;
    });

    return { ...dt, images: imageData };
  });
  return data;
};

export const useProductsQuery = (isEnabled?: boolean) => {
  return useQuery<IProductType[]>(
    [API_ENDPOINTS.PRODUCTS],
    () => fetchAllProducts(),
    {
      enabled: isEnabled ? isEnabled : true,
    }
  );
};

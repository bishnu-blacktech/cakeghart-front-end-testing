// @bishnu thapa

import { IProductType } from '@framework/types';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import server from '@framework/utils/server';
import { useQuery } from 'react-query';

export const fetchProduct = async (_slug: string) => {
  const response = await server.get(`${API_ENDPOINTS.PRODUCTS}${_slug}`);
  const imageData: string[] = response.data.images.map((img: string) => {
    return `${process.env.NEXT_PUBLIC_IMAGE_API_ENDPOINT}${img}`;
  });

  return { ...response.data, images: imageData };
};

export const useProductQuery = (slug: string) => {
  return useQuery<IProductType, Error>([API_ENDPOINTS.PRODUCT, slug], () =>
    fetchProduct(slug)
  );
};

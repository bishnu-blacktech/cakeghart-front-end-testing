import {
  IProductType,
  IProductWithRelatedProductsType,
} from '@framework/types';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import server from '@framework/utils/server';
import { useQuery } from 'react-query';

export const fetchProductWithRelatedProducts = async (_slug: string) => {
  const response = await server.get(
    `${API_ENDPOINTS.PRODUCTS}${_slug}/related`
  );
  const productData: IProductType = response.data.item;
  const relatedProducts: IProductType[] = response.data.relatedItems;

  const normalizedProductData: IProductType = {
    ...productData,
    images: productData.images.map((img) => {
      return `${process.env.NEXT_PUBLIC_IMAGE_API_ENDPOINT}${img}`;
    }),
  };

  const normalizedRelatedProducts: IProductType[] = relatedProducts.map(
    (data) => {
      const imageContainer: string[] = data.images.map((img) => {
        return `${process.env.NEXT_PUBLIC_IMAGE_API_ENDPOINT}${img}`;
      });
      return { ...data, images: imageContainer };
    }
  );

  return {
    item: normalizedProductData,
    relatedItems: normalizedRelatedProducts,
  };
};

export const useProductWithRelatedProductsQuery = (slug: string) => {
  return useQuery<IProductWithRelatedProductsType, Error>(
    [API_ENDPOINTS.PRODUCTS, slug],
    () => fetchProductWithRelatedProducts(slug),
    { enabled: true }
  );
};

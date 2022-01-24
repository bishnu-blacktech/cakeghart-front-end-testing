import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import server from '@framework/utils/server';
import { IProductType } from '@framework/types';

const searchProduct = async (seearchKey: string) => {
  const response = await server.get(
    `${API_ENDPOINTS.SEARCH_PRODUCTS}?query=${seearchKey}&select=all`
  );

  const data = [...response.data].map((dt) => {
    const imageData: string[] = dt.images.map((img: string) => {
      return `${process.env.NEXT_PUBLIC_IMAGE_API_ENDPOINT}${img}`;
    });
    return { ...dt, images: imageData };
  });
  return data;
};

const useSearchProductsQuery = (searchKey: string) => {
  return useQuery<IProductType[]>(
    [API_ENDPOINTS.PRODUCTS_BY_CATEGORY, searchKey],
    () => searchProduct(searchKey)
  );
};

export { useSearchProductsQuery, searchProduct };

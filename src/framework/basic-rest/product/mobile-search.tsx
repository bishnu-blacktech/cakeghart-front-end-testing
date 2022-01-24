import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import server from '@framework/utils/server';
import { IMobileSearchType } from '@framework/types';

const searchMobileProduct = async (seearchKey: string) => {
  const response = await server.get(
    `${API_ENDPOINTS.SEARCH_PRODUCTS}?query=${seearchKey}&select=min`
  );

  const resData = response.data.map((data: IMobileSearchType) => {
    return {
      ...data,
      image: `${process.env.NEXT_PUBLIC_IMAGE_API_ENDPOINT}${data.image}`,
    };
  });
  return resData;
};

const useSearchMobileProductsQuery = (searchKey: string) => {
  return useQuery<IMobileSearchType[]>(
    [API_ENDPOINTS.PRODUCTS_BY_CATEGORY, 'SEARCH_MOBILE', searchKey],
    () => searchMobileProduct(searchKey)
  );
};

export { useSearchMobileProductsQuery, searchMobileProduct };

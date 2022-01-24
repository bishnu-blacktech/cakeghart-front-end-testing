import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import server from '@framework/utils/server';

export interface ICategoryType {
  id: number | string;
  path: string;
  label: string;
}

export const fetchCategories = async () => {
  const response = await server.get(API_ENDPOINTS.CATEGORIES);
  const normalizedCategories: ICategoryType[] = [];

  response.data.forEach((element: any) => {
    normalizedCategories.push({
      id: element._id,
      path: `/products/category/${element._id}`,
      label: element.name,
    });
  });

  return normalizedCategories;
};

export const useCategoriesQuery = () => {
  return useQuery<ICategoryType[]>([API_ENDPOINTS.CATEGORIES], fetchCategories);
};

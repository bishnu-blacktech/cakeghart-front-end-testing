import type { FC } from 'react';
import ProductsGridBlock from '../products-grid-block';
import SomethingWentWrong from '@components/messages/error-message/error-message';
import CustomLoader from '@components/messages/custom-loader/custom-loader';
import DataNotFound from '@components/messages/data-not-found/data.not.fould';
import { IProductType } from '@framework/types';

interface Props {
  className?: string;
  data: IProductType[];
  isLoading: boolean;
  error: any;
  isError: boolean;
}

const BestSellerGroceryProductFeed: FC<Props> = ({
  className,
  data,
  isError,
  isLoading,
  error,
}) => {
  if (isError) return <SomethingWentWrong />;
  if (isLoading) return <CustomLoader />;

  return (
    <ProductsGridBlock
      sectionHeading="text-best-grocery-near-you"
      sectionSubHeading="text-fresh-grocery-items"
      className={className}
      products={data}
      loading={isLoading}
      error={error?.message}
      uniqueKey="best-products"
    />
  );
};
export default BestSellerGroceryProductFeed;

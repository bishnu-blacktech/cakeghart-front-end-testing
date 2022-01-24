import type { FC } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import ProductCard from '@components/product/product-cards/product-card';
import { useSearchProductsQuery } from '@framework/product/search-product';

interface ProductGridProps {
  className?: string;
}

export const ProductGrid: FC<ProductGridProps> = ({ className = '' }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { q: searchKey } = router.query;
  const { data, isLoading, isError } = useSearchProductsQuery(
    searchKey as string
  );

  if (isLoading) return <h1>Loading.........</h1>;
  if (isError) return <h1>Error....</h1>;

  return (
    <>
      <div className="px-2 md:px-4 lg:px-6 xl:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-3 md:gap-4 2xl:gap-5 mt-10">
          {data?.map((item) => (
            <ProductCard key={`product--key-${item.itemId}`} product={item} />
          ))}
        </div>
      </div>
    </>
  );
};

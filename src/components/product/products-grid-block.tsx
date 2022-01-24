import SectionHeader from '@components/common/section-header';
import ProductCard from '@components/product/product-cards/product-card';
import { IProductType } from '@framework/types';
import DataNotFound from '@components/messages/data-not-found/data.not.fould';

interface ProductsProps {
  sectionHeading: string;
  sectionSubHeading?: string;
  headingPosition?: 'left' | 'center';
  className?: string;
  products?: IProductType[];
  loading?: boolean;
  error?: string;
  limit?: number;
  uniqueKey?: string;
}

const ProductsGridBlock: React.FC<ProductsProps> = ({
  headingPosition = 'center',
  className = 'mb-12 lg:mb-14 xl:mb-16',
  products,
  uniqueKey,
}) => {
  return (
    <div className={`${className}`}>
      <SectionHeader
        sectionHeading={'Enjoy our cakes'}
        sectionSubHeading={'We provide best quality & fresh cakes'}
        headingPosition={headingPosition}
      />
      {products?.length === 0 ? (
        <DataNotFound message="No cake found!!!" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-3 md:gap-4 2xl:gap-5">
          {products?.map((product: IProductType) => (
            <ProductCard
              key={`${uniqueKey}-${product._id}`}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsGridBlock;

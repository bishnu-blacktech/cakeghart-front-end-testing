import type { FC } from 'react';
import Image from '@components/ui/image';
import { Product } from '@framework/types';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { RiDeleteBin5Line } from 'react-icons/ri';

interface ProductProps {
  product: Product;
  className?: string;
  removeItem: (id: string | number) => void;
}

const WishlistProductCard: FC<ProductProps> = ({ product, removeItem }) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const placeholderImage = `/assets/placeholder/product.svg`;

  const removeWishListItem = () => {
    removeItem(product.id);
  };

  const redirectToProduct = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <div className="flex flex-col md:flex-row border-b border-skin-base py-4 2xl:py-5 wishlist-card last:pb-0 first:-mt-8 lg:first:-mt-4 2xl:first:-mt-7">
      <div className="flex ">
        <div className="relative flex-shrink-0 mt-1">
          <div
            className="flex overflow-hidden max-w-[80px]  transition duration-200 ease-in-out transform group-hover:scale-105 cursor-pointer"
            onClick={redirectToProduct}
          >
            <Image
              src={product.image ? `${product.image}` : placeholderImage}
              alt={product.name || 'Product Image'}
              width={80}
              height={80}
              quality={100}
              className="object-cover bg-skin-thumbnail"
            />
          </div>
        </div>

        <div className="flex flex-col ms-2 2xl:ms-3.5 h-full">
          <h2 className="text-skin-base text-13px sm:text-sm lg:text-15px leading-5 sm:leading-6 mb-1.5">
            {product.name}
          </h2>
          <div className="text-13px sm:text-sm mb-1 lg:mb-2">
            {product.unit}
          </div>
          <div className="space-s-2 ">
            {product.price && product.price > 0 ? (
              <span className="inline-block font-semibold text-sm sm:text-15px lg:text-base text-skin-base">
                {product.price}
              </span>
            ) : null}
          </div>
        </div>
      </div>
      <div
        className="ms-auto md:pt-7 flex cursor-pointer"
        onClick={() => {
          removeWishListItem();
        }}
      >
        <RiDeleteBin5Line className="text-red-600" />
      </div>
    </div>
  );
};

export default WishlistProductCard;

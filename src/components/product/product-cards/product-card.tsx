import cn from 'classnames';
import Image from '@components/ui/image';
import { IProductType } from '@framework/types';
import useWindowSize from '@utils/use-window-size';
import PlusIcon from '@components/icons/plus-icon';
import { useCart } from '@contexts/cart/cart.context';
import { AddToCart } from '@components/product/add-to-cart';
import { useTranslation } from 'next-i18next';
import { productPlaceholder } from '@assets/placeholders';
import { useEffect, useState } from 'react';
import router from 'next/router';

interface ProductProps {
  product: IProductType;
  className?: string;
}

function RenderPopupOrAddToCart({ data }: { data: IProductType }) {
  const { t } = useTranslation('common');
  const { _id, variations } = data ?? {};
  const { width } = useWindowSize();
  const { isInCart, isInStock } = useCart();
  const iconSize = width! > 1024 ? '19' : '17';

  const outOfStock = isInCart(_id) && !isInStock(_id);

  function handlePopupView() {
    router.push(`/products/${data._id}`);
  }

  if (outOfStock) {
    return (
      <span className="text-[11px] md:text-xs font-bold text-skin-inverted uppercase inline-block bg-skin-red rounded-full px-2.5 pt-1 pb-[3px] mx-0.5 sm:mx-1">
        {t('text-out-stock')}
      </span>
    );
  }

  // checking if product has variant or not

  if (variations && variations.length > 0) {
    return (
      <button
        className="inline-flex bg-skin-primary rounded-full w-8 lg:w-10 h-8 lg:h-10 text-skin-inverted text-4xl items-center justify-center focus:outline-none focus-visible:outline-none"
        aria-label="Count Button"
        onClick={handlePopupView}
      >
        <PlusIcon width={iconSize} height={iconSize} opacity="1" />
      </button>
    );
  }
  return <AddToCart data={data} />;
}

const ProductCard: React.FC<ProductProps> = ({ product, className }) => {
  const { t } = useTranslation('common');

  const { name, images, unit, price, discount, variations } = product;
  const [productRangePrice, setProductRangePrice] = useState<string>('');

  // Calculate the range price of the product.

  const calculateRangePrice = () => {
    if (variations && variations.length > 0) {
      let price = `Rs. ${variations[0].price} - Rs. ${
        variations[variations.length - 1].price
      }`;
      setProductRangePrice(price);
    }
  };

  useEffect(() => {
    calculateRangePrice();
  }, [product]);

  function handlePopupView() {
    router.push(`/products/${product._id}`);
  }

  return (
    <article
      className={cn(
        'flex flex-col group overflow-hidden rounded-md cursor-pointer transition-all duration-300 shadow-card hover:shadow-cardHover relative h-full',
        className
      )}
      onClick={handlePopupView}
      title={name}
    >
      <div className="relative flex-shrink-0">
        <div className="flex overflow-hidden max-w-[230px] mx-auto transition duration-200 ease-in-out transform group-hover:scale-105 relative">
          <Image
            src={images && images.length > 0 ? images[0] : productPlaceholder}
            alt={name || 'Product Image'}
            width={230}
            height={200}
            quality={100}
            className="object-cover bg-skin-thumbnail"
          />
        </div>

        <div className="w-full h-full absolute top-0 pt-2.5 md:pt-3.5 px-3 md:px-4 lg:px-[18px] z-10 -mx-0.5 sm:-mx-1">
          {/* {variations && variations.length > 0 ? (
            variations.find((data) => data.discount && data.discount > 0) ? (
              <span className="text-[11px] md:text-xs font-bold text-skin-inverted uppercase inline-block bg-skin-primary rounded-full px-2.5 pt-1 pb-[3px] mx-0.5 sm:mx-1">
                {t('text-on-sale')}
              </span>
            ) : null
          ) : discount && discount > 0 ? (
            <span className="text-[11px] md:text-xs font-bold text-skin-inverted uppercase inline-block bg-skin-primary rounded-full px-2.5 pt-1 pb-[3px] mx-0.5 sm:mx-1">
              {t('text-on-sale')}
            </span>
          ) : null} */}

          <div className="inline-block product-count-button-position">
            <RenderPopupOrAddToCart data={product} />
          </div>
        </div>
      </div>

      <div className="flex flex-col px-3 md:px-4 lg:px-[18px] pb-5 lg:pb-6 lg:pt-1.5 h-full">
        <div className="space-s-2 mb-1 lg:mb-1.5">
          <span className="inline-block font-semibold text-sm sm:text-15px lg:text-base text-skin-base">
            {variations && variations.length > 0
              ? productRangePrice
              : price && discount && discount > 0
              ? `Rs. ${price - discount}`
              : price
              ? `Rs. ${price}`
              : ''}
          </span>

          {(variations === null || variations.length === 0) &&
          price &&
          discount &&
          discount > 0 ? (
            <del className="text-sm text-skin-base text-opacity-70">
              {`Rs. ${price}`}
            </del>
          ) : null}
        </div>

        <h2 className="text-skin-base text-13px sm:text-sm lg:text-15px leading-5 sm:leading-6 mb-1.5">
          {name}
        </h2>
        <div className="text-13px sm:text-sm mt-auto">{unit}</div>
      </div>
    </article>
  );
};

export default ProductCard;

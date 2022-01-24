import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ROUTES } from '@utils/routes';
import Button from '@components/ui/button';
import Counter from '@components/ui/counter';
import { useCart } from '@contexts/cart/cart.context';
import ProductAttributes from '@components/product/product-attributes';
import { useTranslation } from 'next-i18next';
import ThumbnailCarousel from '@components/ui/carousel/thumbnail-carousel';
import Image from '@components/ui/image';
import CartIcon from '@components/icons/cart-icon';
import Heading from '@components/ui/heading';
import Text from '@components/ui/text';
import { IoArrowRedoOutline } from 'react-icons/io5';
import {
  useModalAction,
  useModalState,
} from '@components/common/modal/modal.context';
import CloseButton from '@components/ui/close-button';
import VariationPrice from './variation-price';
import { productGalleryPlaceholder } from '@assets/placeholders';
import { IVariantionType } from '@framework/types';
import useWindowSize from '@utils/use-window-size';
import SocialShareBox from '@components/ui/social-share-box';

import {
  generateCartItem,
  ItemType,
  IVariationType,
} from '@utils/generate-cart-item';
import { toast } from 'react-toastify';

// Interface or type defining

interface IRangePrice {
  minPrice: number;
  maxPrice: number;
}

// defining initial data

const initialPriceRange: IRangePrice = {
  minPrice: 0,
  maxPrice: 0,
};

export default function ProductPopup() {
  const { t } = useTranslation('common');
  const { data } = useModalState();
  const { closeModal } = useModalAction();
  const router = useRouter();
  const { addItemToCart, isInCart, getItemFromCart, isInStock } = useCart();
  const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);
  const { width } = useWindowSize();
  const [shareButtonStatus, setShareButtonStatus] = useState<boolean>(false);

  // @bishnu thapa

  const { _id, price, images, name, discount, unit, description, variations } =
    data;

  //const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${ROUTES.PRODUCT}/${_id}`;
  const productUrl = `https://en.wikipedia.org/wiki/%22Hello,_World!%22_program`;

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] =
    useState<IVariantionType | null>(null);
  const [rangePrice, setRangePrice] = useState<IRangePrice>(initialPriceRange);

  useEffect(() => {
    if (variations && variations.length > 0) {
      const minPrice = variations[0].price;
      const maxPrice = variations[variations.length - 1].price;
      setRangePrice({ minPrice: minPrice, maxPrice: maxPrice });
    }
  }, []);

  const handleChange = () => {
    setShareButtonStatus(!shareButtonStatus);
  };

  function addProductToCart() {
    const productDetails: ItemType = {
      id: _id,
      name: name,
      slug: _id,
      image: {
        thumbnail: images.length > 0 ? images[0] : productGalleryPlaceholder,
      },
      price: price,
      sale_price: price - discount,
      quantity: 100,
    };

    const variantDetails: IVariationType = {
      id: selectedVariant ? selectedVariant.size : 0,
      title: selectedVariant ? selectedVariant.size : '',
      price: selectedVariant ? selectedVariant.price : 0,
      sale_price: selectedVariant
        ? selectedVariant.price -
          (selectedVariant.discount ? selectedVariant.discount : 0)
        : price - discount,
      quantity: selectedVariant ? 100 : 0,
    };

    // To show btn feedback while product carting
    setAddToCartLoader(true);

    setTimeout(() => {
      setAddToCartLoader(false);
    }, 1500);

    if (selectedVariant) {
      const item = generateCartItem(productDetails, variantDetails);

      addItemToCart(item, selectedQuantity);
      return true;
    } else {
      const item = generateCartItem(productDetails, null);
      addItemToCart(item, selectedQuantity);
      return true;
    }
  }

  function addToCart() {
    if (addProductToCart()) {
      toast(t(`${name} is successfully added to cart.`), {
        progressClassName: 'fancy-progress-bar',
        position: width! > 768 ? 'bottom-right' : 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setSelectedQuantity(1);
    }
  }

  function addToWishlist() {}

  function navigateToProductPage() {
    closeModal();
    router.push(`${ROUTES.PRODUCT}/${_id}`);
  }

  function buyNow() {
    if (addProductToCart()) {
      closeModal();
      router.push('/checkout');
    }
  }

  return (
    <div className="md:w-[600px] lg:w-[940px] xl:w-[1180px] 2xl:w-[1360px] mx-auto p-1 lg:p-0 xl:p-3 bg-skin-fill rounded-md">
      <CloseButton onClick={closeModal} />
      <div className="overflow-hidden">
        <div className="px-4 md:px-6 lg:p-8 2xl:p-10 mb-9 lg:mb-2 pt-4 md:pt-7 2xl:pt-10">
          <div className="lg:flex items-start justify-between">
            <div className="xl:flex items-center justify-center overflow-hidden mb-6 md:mb-8 lg:mb-0">
              {!!images?.length ? (
                <ThumbnailCarousel gallery={images} />
              ) : (
                <div className="w-auto flex items-center justify-center">
                  <Image
                    src={images[0] ?? productGalleryPlaceholder}
                    alt={name!}
                    width={650}
                    height={590}
                  />
                </div>
              )}
            </div>

            <div className="flex-shrink-0 flex flex-col lg:ps-5 xl:ps-8 2xl:ps-10 lg:w-[430px] xl:w-[470px] 2xl:w-[480px]">
              <div className="pb-5">
                <div
                  className="mb-2 md:mb-2.5 block -mt-1.5"
                  onClick={navigateToProductPage}
                  role="button"
                >
                  <h2 className="text-skin-base text-lg md:text-xl xl:text-2xl font-medium transition-colors duration-300 hover:text-skin-primary">
                    {name}
                  </h2>
                </div>
                {(variations === null || variations.length === 0) && unit && (
                  <div className="text-sm md:text-15px font-medium">{unit}</div>
                )}

                {selectedVariant ? (
                  <>
                    <div className="text-skin-base font-bold text-base md:text-xl xl:text-[22px] inline-block">
                      {`Rs. ${selectedVariant.price}`}
                    </div>

                    {selectedVariant.discount !== null &&
                      selectedVariant.discount > 0 && (
                        <del className="text-sm md:text-15px ps-3 text-skin-base text-opacity-50 inline-block">
                          {selectedVariant.price +
                            (selectedVariant.price * selectedVariant.discount) /
                              100}
                        </del>
                      )}
                    {selectedVariant.discount !== null &&
                      selectedVariant.discount > 0 && (
                        <span className="inline-block rounded font-bold text-xs md:text-sm bg-skin-tree bg-opacity-20 text-skin-tree uppercase px-2 py-1 ms-2.5">
                          {selectedVariant.discount} {t('text-off')}
                        </span>
                      )}
                  </>
                ) : (
                  <VariationPrice
                    price={price}
                    discount={discount}
                    minPrice={rangePrice.minPrice}
                    maxPrice={rangePrice.maxPrice}
                  />
                )}
              </div>

              {/* num of remaining product which has variant. */}
              {variations && variations.length > 0 && (
                <ProductAttributes
                  variations={variations}
                  selectedVariation={selectedVariant}
                  setSelectedVariantion={setSelectedVariant}
                  setQuantity={setSelectedQuantity}
                />
              )}

              <div className="pt-1.5 lg:pt-3 xl:pt-4 space-y-2.5 md:space-y-3.5">
                <Counter
                  variant="single"
                  value={selectedQuantity}
                  onIncrement={() => {
                    setSelectedQuantity((prev) => prev + 1);
                  }}
                  onDecrement={() => {
                    if (selectedQuantity <= 1) return;
                    setSelectedQuantity((prev) => (prev !== 1 ? prev - 1 : 1));
                  }}
                  disabled={
                    selectedVariant
                      ? isInCart(`${_id}.${selectedVariant.size}`)
                        ? getItemFromCart(`${_id}.${selectedVariant.size}`)
                            .quantity +
                            selectedQuantity >=
                          100
                        : selectedQuantity >= 100
                      : isInCart(_id)
                      ? getItemFromCart(_id).quantity + selectedQuantity >= 100
                      : selectedQuantity >= 100
                  }
                />

                <div className="grid grid-cols-2 gap-2.5">
                  <Button
                    onClick={buyNow}
                    className="w-full px-1.5"
                    disabled={
                      selectedQuantity === 0
                        ? true
                        : data.variations === null ||
                          data.variations.length === 0
                        ? false
                        : selectedVariant
                        ? false
                        : true
                    }
                  >
                    <CartIcon color="#ffffff" className="me-3" />
                    {t('Buy now')}
                  </Button>

                  <Button
                    variant="border"
                    className="group hover:text-white text-white bg-yellow-600"
                    disabled={
                      selectedQuantity === 0
                        ? true
                        : data.variations === null ||
                          data.variations.length === 0
                        ? false
                        : selectedVariant
                        ? false
                        : true
                    }
                    onClick={addToCart}
                    loading={addToCartLoader}
                  >
                    {t('Add to cart')}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <Button
                    variant="border"
                    onClick={addToWishlist}
                    // loading={addToWishlistLoader}
                    className="group hover:text-skin-primary"
                  >
                    {t('text-wishlist')}
                  </Button>
                  <div className="relative group">
                    <Button
                      variant="border"
                      className="w-full hover:text-skin-primary"
                      onClick={handleChange}
                    >
                      <IoArrowRedoOutline className="text-2xl md:text-[26px] me-2 transition-all group-hover:text-skin-primary" />
                      {t('text-share')}
                    </Button>
                    <SocialShareBox
                      className={`absolute z-10 end-0 w-[300px] md:min-w-[400px] transition-all duration-300 ${
                        shareButtonStatus === true
                          ? 'visible opacity-100 top-full'
                          : 'opacity-0 invisible top-[130%]'
                      }`}
                      shareUrl={productUrl}
                    />

                    {/* Add social share component */}
                  </div>
                </div>
              </div>

              <div className="pt-6 xl:pt-8">
                <Heading className="mb-3 lg:mb-3.5">
                  {t('text-product-details')}:
                </Heading>
                <Text variant="small">
                  {description.split(' ').slice(0, 40).join(' ')}
                  {'...'}
                  <span
                    // onClick={navigateToProductPage}
                    role="button"
                    className="text-skin-primary ms-0.5"
                  >
                    {t('text-read-more')}
                  </span>
                </Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

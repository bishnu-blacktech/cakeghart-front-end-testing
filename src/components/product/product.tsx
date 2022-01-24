import { useRouter } from 'next/router';
import useWindowSize from '@utils/use-window-size';
import { useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useCart } from '@contexts/cart/cart.context';
import {
  generateCartItem,
  ItemType,
  IVariationType,
} from '@utils/generate-cart-item';
import { productGalleryPlaceholder } from '@assets/placeholders';
import { IProductType, IVariantionType, IWishListType } from '@framework/types';
import ThumbnailCarousel from '@components/ui/carousel/thumbnail-carousel';
import VariationPrice from './variation-price';
import ProductAttributes from '@components/product/product-attributes';
import Counter from '@components/ui/counter';
import Button from '@components/ui/button';
import CartIcon from '@components/icons/cart-icon';
import { IoArrowRedoOutline } from 'react-icons/io5';
import Heading from '@components/ui/heading';
import Text from '@components/ui/text';
import SocialShareBox from '@components/ui/social-share-box';
import { toast } from 'react-toastify';
import { useLocalStorage } from 'react-use';
import { useUI } from '@contexts/ui.context';
import { useModalAction } from '@components/common/modal/modal.context';

interface IProps {
  data: IProductType;
}

interface IRangePrice {
  minPrice: number;
  maxPrice: number;
}

const initialPriceRange: IRangePrice = {
  minPrice: 0,
  maxPrice: 0,
};

const ProductSingleDetails: React.FC<IProps> = ({ data }) => {
  const { isAuthorized } = useUI();
  const { openModal } = useModalAction();
  const router = useRouter();
  const { width } = useWindowSize();
  const { t } = useTranslation('common');
  const { addItemToCart, isInCart, getItemFromCart } = useCart();
  const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);
  const [buyNowLoader, setBuyNowLoader] = useState<boolean>(false);
  const [shareButtonStatus, setShareButtonStatus] = useState<boolean>(false);

  //const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${ROUTES.PRODUCT}/${_id}`;
  const productUrl = `https://en.wikipedia.org/wiki/%22Hello,_World!%22_program`;

  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] =
    useState<IVariantionType | null>(null);
  const [rangePrice, setRangePrice] = useState<IRangePrice>(initialPriceRange);

  const [favoriatedList, setFavoriatedList] =
    useLocalStorage<IWishListType[]>('favoriated_list');
  const [wishListLoader, setWishListLoader] = useState<boolean>(false);

  useEffect(() => {
    if (data && data.variations && data.variations.length > 0) {
      const minPrice = data.variations[0].price;
      const maxPrice = data.variations[data.variations.length - 1].price;
      setRangePrice({ minPrice: minPrice, maxPrice: maxPrice });
    }
  }, []);

  const handleChange = () => {
    setShareButtonStatus(!shareButtonStatus);
  };

  function addProductToCart(actionType: 'CART' | 'BUY_NOW'): boolean {
    if (data) {
      const productDetails: ItemType = {
        id: data._id,
        name: data.name,
        slug: data._id,
        image: {
          thumbnail:
            data.images.length > 0 ? data.images[0] : productGalleryPlaceholder,
        },
        price: data.price ? data.price : 0,
        sale_price:
          data.price && data.discount ? data.price - data.discount : 0,
        quantity: 100,
      };

      const variantDetails: IVariationType = {
        id: selectedVariant ? selectedVariant._id : 0,
        title: selectedVariant ? selectedVariant.size : '',
        price: selectedVariant ? selectedVariant.price : 0,
        sale_price: selectedVariant
          ? selectedVariant.price -
            (selectedVariant.discount ? selectedVariant.discount : 0)
          : 0,
        quantity: selectedVariant ? 100 : 0,
      };

      // Setting loader either for cart or buy now

      if (actionType === 'CART') setAddToCartLoader(true);
      if (actionType === 'BUY_NOW') setBuyNowLoader(true);

      setTimeout(() => {
        setAddToCartLoader(false);
        setBuyNowLoader(false);
      }, 1500);

      if (selectedVariant) {
        const item = generateCartItem(productDetails, variantDetails);

        addItemToCart(item, selectedQuantity);
      } else {
        const item = generateCartItem(productDetails, null);
        addItemToCart(item, selectedQuantity);
      }
      setSelectedQuantity(1);
      return true;
    }
    return false;
  }

  function addToCart() {
    if (addProductToCart('CART')) {
      toast(t(`${data.name} is successfully added to cart.`), {
        progressClassName: 'fancy-progress-bar',
        position: width! > 768 ? 'bottom-right' : 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  function buyNow() {
    if (addProductToCart('BUY_NOW')) {
      router.push('/checkout');
    }
  }

  function addToWishlist() {
    if (!isAuthorized) {
      toast.error(t(`you have to login to add product on wishlist.`), {
        progressClassName: 'fancy-progress-bar',
        position: width! > 768 ? 'bottom-right' : 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      openModal('LOGIN_VIEW');
      return;
    }

    setWishListLoader(true);
    if (favoriatedList) {
      for (let index = 0; index < favoriatedList.length; index++) {
        const element = favoriatedList[index];
        if (element.id === data._id) {
          toast.error(
            t(`${data.name} has already existed in your wish list.`),
            {
              progressClassName: 'fancy-progress-bar',
              position: width! > 768 ? 'bottom-right' : 'top-right',
              autoClose: 1500,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );

          setWishListLoader(false);
          return;
        }
      }

      setFavoriatedList([
        ...favoriatedList,
        {
          id: data._id,
          name: data.name,
          price: data.price,
          image: data.images[0],
          unit: data.unit,
        },
      ]);
      toast(t(`${data.name} is successfully added in your wish cart.`), {
        progressClassName: 'fancy-progress-bar',
        position: width! > 768 ? 'bottom-right' : 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setWishListLoader(false);
      return;
    }

    setFavoriatedList([
      {
        id: data._id,
        name: data.name,
        price: data.price,
        image: data.images[0],
        unit: data.unit,
      },
    ]);
    toast(t(`${data.name} is successfully added in your wish cart.`), {
      progressClassName: 'fancy-progress-bar',
      position: width! > 768 ? 'bottom-right' : 'top-right',
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    setWishListLoader(false);
  }

  if (!data) return <h1>Loading</h1>;

  return (
    <div className="pt-6 md:pt-7 pb-2">
      {data && (
        <div className="lg:grid grid-cols-10 gap-7 2xl:gap-8">
          <div className="col-span-5 xl:col-span-6 overflow-hidden mb-6 md:mb-8 lg:mb-0">
            {data.images.length > 0 && (
              <ThumbnailCarousel
                gallery={data.images}
                thumbnailClassName="xl:w-[700px] 2xl:w-[900px]"
                galleryClassName="xl:w-[150px] 2xl:w-[170px]"
              />
            )}
          </div>

          <div className="flex-shrink-0 flex flex-col col-span-5 xl:col-span-4 xl:ps-2">
            <div className="pb-3 lg:pb-5">
              <div className="md:mb-2.5 block -mt-1.5">
                <h2 className="text-skin-base text-lg md:text-xl xl:text-2xl font-medium transition-colors duration-300">
                  {data.name}
                </h2>
              </div>
              {(data.variations === null || data.variations.length === 0) &&
                data.unit && (
                  <div className="text-sm md:text-15px font-medium">
                    {data.unit}
                  </div>
                )}
              {selectedVariant ? (
                <>
                  <div className="text-skin-base font-bold text-base md:text-xl xl:text-[22px] inline-block">
                    {`Rs. ${
                      selectedVariant.price -
                      (selectedVariant.discount ? selectedVariant.discount : 0)
                    }`}
                  </div>

                  {selectedVariant.discount !== null &&
                    selectedVariant.discount > 0 && (
                      <del className="text-sm md:text-15px ps-3 text-red-500 font-bold text-opacity-50 inline-block">
                        {selectedVariant.price + selectedVariant.discount}
                      </del>
                    )}
                  {selectedVariant.discount !== null &&
                    selectedVariant.discount > 0 && (
                      <span className="inline-block rounded font-bold text-xs md:text-sm bg-skin-tree bg-opacity-20 text-skin-tree uppercase px-2 py-1 ms-2.5">
                        {`Rs. ${selectedVariant.discount} `}
                        {t('text-off')}
                      </span>
                    )}
                </>
              ) : (
                <VariationPrice
                  price={data.price}
                  discount={data.discount}
                  minPrice={rangePrice.minPrice}
                  maxPrice={rangePrice.maxPrice}
                />
              )}
            </div>

            {/* num of remaining product which has variant. */}
            {data.variations && data.variations.length > 0 && (
              <ProductAttributes
                variations={data.variations}
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
                  if (
                    data.variations &&
                    data.variations.length > 0 &&
                    selectedVariant === null
                  ) {
                    return;
                  }
                  setSelectedQuantity((prev) => prev + 1);
                }}
                onDecrement={() => {
                  if (selectedQuantity <= 1) return;
                  setSelectedQuantity((prev) => (prev !== 1 ? prev - 1 : 1));
                }}
                disabled={
                  selectedVariant
                    ? isInCart(`${data._id}.${selectedVariant.size}`)
                      ? getItemFromCart(`${data._id}.${selectedVariant.size}`)
                          .quantity +
                          selectedQuantity >=
                        100
                      : selectedQuantity >= 100
                    : isInCart(data._id)
                    ? getItemFromCart(data._id).quantity + selectedQuantity >=
                      100
                    : selectedQuantity >= 100
                }
              />

              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  variant="border"
                  className="group hover:text-white text-white bg-yellow-600"
                  disabled={
                    selectedQuantity === 0
                      ? true
                      : data.variations === null || data.variations.length === 0
                      ? false
                      : selectedVariant
                      ? false
                      : true
                  }
                  loading={buyNowLoader}
                  onClick={buyNow}
                >
                  {t('Buy now')}
                </Button>
                <Button
                  onClick={addToCart}
                  className="w-full px-1.5"
                  disabled={
                    selectedQuantity === 0
                      ? true
                      : data.variations === null || data.variations.length === 0
                      ? false
                      : selectedVariant
                      ? false
                      : true
                  }
                  loading={addToCartLoader}
                >
                  <CartIcon color="#ffffff" className="me-3" />
                  {t('text-add-to-cart')}
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  variant="border"
                  onClick={addToWishlist}
                  loading={wishListLoader}
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
                </div>

                <div className="pt-6 xl:pt-8">
                  <Heading className="mb-3 lg:mb-3.5">
                    {t('text-product-details')}:
                  </Heading>
                  <Text variant="small">{data.description}</Text>
                </div>
              </div>
            </div>

            {/* end of right div */}
          </div>

          {/* parent code */}
        </div>
      )}
    </div>
  );
};

export default ProductSingleDetails;

import Counter from '@components/ui/counter';
import { useCart } from '@contexts/cart/cart.context';
import { generateCartItem } from '@utils/generate-cart-item';
import PlusIcon from '@components/icons/plus-icon';
import useWindowSize from '@utils/use-window-size';
import { IProductType } from '@framework/types';

interface Props {
  data: IProductType;
  variation?: any;
  disabled?: boolean;
}

export const AddToCart = ({ data, disabled }: Props) => {
  const { width } = useWindowSize();
  const {
    addItemToCart,
    removeItemFromCart,
    isInStock,
    getItemFromCart,
    isInCart,
  } = useCart();

  const item = generateCartItem(
    {
      id: data._id,
      name: data.name,
      slug: data.name,
      image: {
        thumbnail: data.images[0],
      },
      price: data.price ? data.price : 0,
      sale_price: data.price
        ? data.discount && data.discount > 0
          ? data.price - data.discount
          : data.price
        : 0,
      quantity: 100,
    },
    null
  );

  const handleAddClick = (
    e: React.MouseEvent<HTMLButtonElement | MouseEvent>
  ) => {
    e.stopPropagation();
    addItemToCart(item, (getItemFromCart(item.id)?.quantity || 0) + 1);
  };

  const handleRemoveClick = (e: any) => {
    e.stopPropagation();
    removeItemFromCart(item.id);
  };

  const outOfStock = isInCart(item?.id) && !isInStock(item.id);
  const iconSize = width! > 480 ? '19' : '17';

  return !isInCart(item?.id) ? (
    <button
      className="bg-skin-primary rounded-full w-8 lg:w-10 h-8 lg:h-10 text-skin-inverted text-4xl flex items-center justify-center focus:outline-none"
      aria-label="Count Button"
      onClick={handleAddClick}
      disabled={disabled || outOfStock}
    >
      <PlusIcon width={iconSize} height={iconSize} opacity="1" />
    </button>
  ) : (
    <Counter
      value={getItemFromCart(item.id).quantity}
      onDecrement={handleRemoveClick}
      onIncrement={handleAddClick}
      disabled={outOfStock}
    />
  );
};

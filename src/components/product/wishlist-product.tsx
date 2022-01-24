import WishlistProductCard from '@components/product/wishlist-product-card';
import type { FC } from 'react';
import cn from 'classnames';
import { useLocalStorage } from 'react-use';
import { IWishListType } from '@framework/types';
interface ProductWishlistProps {
  element?: any;
  className?: string;
}
const ProductWishlistGrid: FC<ProductWishlistProps> = ({ className = '' }) => {
  const [wishList, setWishList] =
    useLocalStorage<IWishListType[]>('favoriated_list');

  const removeWishListItem = (id: string | number) => {
    setWishList(wishList?.filter((data) => data.id !== id));
  };

  return (
    <div className={cn(className)}>
      {wishList?.map((product: any) => (
        <WishlistProductCard
          key={`product--key${product.id}`}
          product={product}
          removeItem={removeWishListItem}
        />
      ))}
    </div>
  );
};
export default ProductWishlistGrid;

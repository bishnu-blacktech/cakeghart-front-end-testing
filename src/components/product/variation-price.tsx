import { useTranslation } from 'next-i18next';

export default function VariationPrice({
  price,
  minPrice,
  maxPrice,
  discount,
}: any) {
  const { t } = useTranslation('common');

  return (
    <div className="flex items-center mt-5">
      <div className="text-skin-base font-bold text-base md:text-xl xl:text-[22px]">
        {price && minPrice === maxPrice
          ? `Rs. ${discount && discount > 0 ? price - discount : price}`
          : `Rs. ${minPrice} - Rs. ${maxPrice}`}
      </div>

      {price && minPrice === maxPrice && discount && discount > 0 ? (
        <del className="text-sm md:text-15px ps-3 text-skin-base text-opacity-50">
          {price}
        </del>
      ) : null}

      {discount && discount > 0 ? (
        <span className="inline-block rounded font-bold text-xs md:text-sm bg-skin-tree bg-opacity-20 text-skin-tree uppercase px-2 py-1 ms-2.5">
          {`Rs. ${discount}`} {t('text-off')}
        </span>
      ) : null}
    </div>
  );
}

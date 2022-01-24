import { IVariantionType } from '@framework/types';
import cn from 'classnames';

interface Props {
  className?: string;
  variations: IVariantionType[];
  selectedVariation: IVariantionType | null;
  setSelectedVariantion: (key: any) => void;
  setQuantity: (key: any) => void;
}

const ProductAttributes: React.FC<Props> = ({
  variations,
  selectedVariation,
  setSelectedVariantion,
  setQuantity,
}) => {
  if (!variations) return null;
  return (
    <>
      <div>
        <h4 className="text-15px text-skin-base text-opacity-70 font-normal mb-3 capitalize">
          Available In
        </h4>
        <ul className="flex flex-wrap -me-2">
          {variations.map((varItem) => (
            <li
              key={varItem.size}
              className={cn(
                'cursor-pointer rounded border h-9 md:h-10 p-1 mb-2 md:mb-3 me-2 flex justify-center items-center font-medium text-sm md:text-15px text-skin-base transition duration-200 ease-in-out hover:text-skin-primary hover:border-skin-primary px-3',
                {
                  'border-skin-primary text-skin-primary':
                    selectedVariation && selectedVariation.size === varItem.size
                      ? true
                      : false,
                }
              )}
              onClick={() => {
                setSelectedVariantion(varItem);
                setQuantity(1);
              }}
            >
              {varItem.size}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ProductAttributes;

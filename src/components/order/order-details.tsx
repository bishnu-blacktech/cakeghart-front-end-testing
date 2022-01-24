import { useOrderQuery } from '@framework/order/get-order';
import { IOrderItemType } from '@framework/types';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Heading from '@components/ui/heading';
import CustomLoader from '@components/messages/custom-loader/custom-loader';
import SomethingWentWrong from '@components/messages/error-message/error-message';
import DataNotFound from '@components/messages/data-not-found/data.not.fould';

interface IOrderItemCartProps {
  product: IOrderItemType;
  key: number;
}

const OrderItemCard: React.FC<IOrderItemCartProps> = ({ product, key }) => {
  return (
    <tr
      className="border-b font-normal border-skin-base last:border-b-0"
      key={`indiv-${key}`}
    >
      <td className="p-4">
        {product.name} * {product.quantity}
      </td>
      <td className="p-4">
        {product.price} (Discount: Rs.{' '}
        {product.discount > 0 ? product.discount : 0})
      </td>
    </tr>
  );
};

const OrderDetails: React.FC = () => {
  const className = 'pt-10 lg:pt-12';

  const { t } = useTranslation('common');
  const {
    query: { id },
  } = useRouter();

  const { data: order, isLoading, isError } = useOrderQuery(id?.toString()!);

  if (isLoading) return <CustomLoader />;
  if (isError) return <SomethingWentWrong message="OOPS, data not found!!!" />;
  if (!order) return <DataNotFound />;

  return (
    <div className={className}>
      <Heading variant="heading" className="mb-6 xl:mb-7">
        {t('text-order-details')}:
      </Heading>

      <table className="w-full text-skin-base font-semibold text-sm lg:text-base">
        <thead>
          <tr>
            <th className="bg-skin-secondary p-4 text-start first:rounded-ts-md w-1/2">
              {t('text-product')}
            </th>
            <th className="bg-skin-secondary p-4 text-start last:rounded-te-md w-1/2">
              {t('text-total')}
            </th>
          </tr>
        </thead>
        <tbody>
          {order?.products.map((product, index) => (
            <OrderItemCard key={index} product={product} />
          ))}
        </tbody>
        <tfoot>
          <tr className="odd:bg-skin-secondary">
            <td className="p-4 italic">{t('text-total')}:</td>
            <td className="p-4">{order.totalPrice}</td>
          </tr>

          <tr className="odd:bg-skin-secondary">
            <td className="p-4 italic">Name:</td>
            <td className="p-4">{`${order.name.first} ${order.name.last}`}</td>
          </tr>

          <tr className="odd:bg-skin-secondary">
            <td className="p-4 italic">Contact:</td>
            <td className="p-4">{order.phone}</td>
          </tr>

          <tr className="odd:bg-skin-secondary">
            <td className="p-4 italic">Email:</td>
            <td className="p-4">{order.email}</td>
          </tr>
        </tfoot>
      </table>

      <h1 className="font-bold">Instruction:</h1>
      {order.notice && <p className="mt-2">{order.notice}</p>}
    </div>
  );
};

export default OrderDetails;

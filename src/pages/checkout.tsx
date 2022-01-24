import Layout from '@components/layout/layout';
import CheckoutCard from '@components/checkout/checkout-card';
import Container from '@components/ui/container';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Divider from '@components/ui/divider';
import Seo from '@components/seo/seo';
import CheckoutForm from '@components/checkout/checkout-form';
import { useForm } from 'react-hook-form';
import { useUserQuery } from '@framework/customer/get-user-details';
import { useCart } from '@contexts/cart/cart.context';
import { getToken } from '@framework/utils/get-token';
import { useEffect } from 'react';
import { useUI } from '@contexts/ui.context';
import {
  ICheckOutItemType,
  useOrderMutation,
} from '@framework/order/make-order';
import CustomLoader from '@components/messages/custom-loader/custom-loader';
import DataNotFound from '@components/messages/data-not-found/data.not.fould';
import { toast } from 'react-toastify';
import { useAddressQuery } from '@framework/address/address';

export interface IDeliveryDataType {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  extraAddress?: string;
  date: Date;
  time: string;
  email: string;
  orderNotice: string;
}

function CheckoutPage() {
  const { items } = useCart();
  const { isAuthorized } = useUI();
  const { mutate: makeOrder, isLoading: isMakeOrderLoading } =
    useOrderMutation();
  const { data, isLoading, refetch } = useUserQuery(false);
  const {
    data: addressData,
    isLoading: isAddressLoading,
    refetch: refetchAddress,
  } = useAddressQuery(false);

  // If user is logined then this useEffect runs

  useEffect(() => {
    if (isAuthorized) {
      refetch();
      refetchAddress();
    }
  }, [isAuthorized]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IDeliveryDataType>();

  const onSubmit = (data: any) => {
    if (items.length === 0) {
      toast.error('Please add some cakes on the cart first.');
      return;
    }

    const itemData: ICheckOutItemType[] = [];

    items.map((data) => {
      const singleItem: ICheckOutItemType = {
        itemId: data.id,
        quantity: data.quantity ? data.quantity : 0,
      };

      if (data.variationId) {
        singleItem.variationId = data.variationId;
        singleItem.itemId = data.productId;
      }

      itemData.push(singleItem);
    });

    makeOrder({
      items: itemData,
      location: data.extraAddress ? data.extraAddress : data.address,
      phone: data.phone,
      date: data.date,
      time: data.time,
      name: { first: data.firstName, last: data.lastName },
      email: data.email ? data.email : '',
      notice: data.orderNotice,
    });
  };

  if (items && items.length === 0)
    return <DataNotFound message="Sorry, there is no data on cart!!!" />;

  if (isAuthorized && (isLoading || isAddressLoading)) return <CustomLoader />;

  if (isMakeOrderLoading) {
    <div>Please wait your order is in processing.</div>;
  }

  return (
    <>
      <Seo
        title="Checkout"
        description="Fastest E-commerce template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        path="checkout"
      />
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Container className="py-10 2xl:py-12 border-t border-skin-base checkout">
          <div className="flex xl:max-w-screen-xl mx-auto flex-col">
            <div className="flex flex-col lg:grid lg:grid-cols-12 grid-cols-1 flex-wrap gap-8">
              <div className="w-full col-start-1 col-end-8">
                <CheckoutForm
                  register={register}
                  errors={errors}
                  data={data}
                  isAuthorized={getToken() ? true : false}
                  address={addressData ? addressData : []}
                />
              </div>
              <div className="w-full mt-7 lg:mt-0 col-start-8 col-end-13">
                <CheckoutCard />
              </div>
            </div>
          </div>
        </Container>
      </form>

      <Divider />
    </>
  );
}

CheckoutPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'forms',
        'menu',
        'footer',
      ])),
    },
  };
};

export default CheckoutPage;

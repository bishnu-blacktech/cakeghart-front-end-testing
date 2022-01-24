import React, { useEffect } from 'react';
import Layout from '@components/layout/layout';
import AccountLayout from '@components/my-account/account-layout';
import OrderTable from '@components/order/order-table';
import { useOrdersQuery } from '@framework/order/get-all-orders';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Seo from '@components/seo/seo';
import SomethingWentWrong from '@components/messages/error-message/error-message';
import CustomLoader from '@components/messages/custom-loader/custom-loader';
import { useModalAction } from '@components/common/modal/modal.context';
import { getToken } from '@framework/utils/get-token';
import DataNotFound from '@components/messages/data-not-found/data.not.fould';
import { useUI } from '@contexts/ui.context';

export default function OrdersTablePage() {
  const { closeModal, openModal } = useModalAction();
  const { isAuthorized } = useUI();
  const { data, isLoading, isError, refetch } = useOrdersQuery();

  useEffect(() => {
    refetch();
  }, [isAuthorized]);

  if (!getToken()) {
    closeModal();
    openModal('LOGIN_VIEW');
    return <SomethingWentWrong message="You are not logedin!!!" />;
  }

  if (isError) return <SomethingWentWrong />;
  if (isLoading) return <CustomLoader />;
  if (data?.length === 0) {
    return (
      <DataNotFound message="sorry, there is no data on your order section." />
    );
  }

  return (
    <>
      <Seo
        title="Orders"
        description="Fastest E-commerce template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        path="my-account/orders"
      />

      <AccountLayout>{data && <OrderTable orders={data} />}</AccountLayout>
    </>
  );
}

OrdersTablePage.Layout = Layout;

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

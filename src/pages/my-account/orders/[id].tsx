import Layout from '@components/layout/layout';
import AccountLayout from '@components/my-account/account-layout';
import OrderDetails from '@components/order/order-details';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { useUI } from '@contexts/ui.context';
import { useModalAction } from '@components/common/modal/modal.context';
import SomethingWentWrong from '@components/messages/error-message/error-message';

export default function OrderPage() {
  const { openModal } = useModalAction();
  const { isAuthorized } = useUI();

  if (!isAuthorized) {
    openModal('LOGIN_VIEW');
    return <SomethingWentWrong message="you are not logedin!!!" />;
  }

  return (
    <AccountLayout>
      <OrderDetails />
    </AccountLayout>
  );
}

OrderPage.Layout = Layout;

export const getServerSideProps: GetServerSideProps = async ({
  locale,
}: any) => {
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

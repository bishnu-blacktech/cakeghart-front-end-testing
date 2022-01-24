import Layout from '@components/layout/layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Container from '@components/ui/container';
import ProductCard from '@components/product/product-cards/product-card';
import SectionHeader from '@components/common/section-header';
import { useProductFilteredByCategoryQuery } from '@framework/product/get-all-products-by-category';
import CustomLoader from '@components/messages/custom-loader/custom-loader';
import SomethingWentWrong from '@components/messages/error-message/error-message';
import DataNotFound from '@components/messages/data-not-found/data.not.fould';

const FilteredProducts = () => {
  const router = useRouter();
  const {
    query: { slug },
  } = router;

  const { data, isLoading, isError } = useProductFilteredByCategoryQuery(
    slug as string
  );

  if (isError) return <SomethingWentWrong />;
  if (isLoading) return <CustomLoader />;
  if (data?.length === 0) return <DataNotFound message="No cake found" />;

  return (
    <>
      <div className="px-5 mt-5">
        <SectionHeader
          sectionHeading={'Enjoy our cakes'}
          headingPosition="center"
        />
        <Container>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-3 md:gap-4 2xl:gap-5">
            {data?.map((product) => (
              <ProductCard
                key={`product-category-${product._id}`}
                product={product}
              />
            ))}
          </div>
        </Container>
      </div>
    </>
  );
};

FilteredProducts.Layout = Layout;

export default FilteredProducts;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        'common',
        'forms',
        'menu',
        'footer',
      ])),
    },
  };
};

import Container from '@components/ui/container';
import Layout from '@components/layout/layout';
import ProductSingleDetails from '@components/product/product';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import Divider from '@components/ui/divider';
import { useRouter } from 'next/router';
import CustomLoader from '@components/messages/custom-loader/custom-loader';
import DataNotFound from '@components/messages/data-not-found/data.not.fould';
import SectionHeader from '@components/common/section-header';
import ProductCard from '@components/product/product-cards/product-card';
import { useProductsQuery } from '@framework/product/get-all-products';
import { useEffect, useState } from 'react';
import { IProductType } from '@framework/types';
import Breadcrumb from '@components/ui/breadcrumb';

export default function ProductPage() {
  const router = useRouter();
  const {
    query: { slug },
  } = router;

  const { data, isLoading, isError } = useProductsQuery();
  const [singleItem, setSingleItem] = useState<IProductType>();
  const [allItems, setAllItems] = useState<IProductType[]>([]);

  useEffect(() => {
    if (data) {
      const singleCake: IProductType | undefined = data.find(
        (dt) => dt._id === slug
      );
      const allCakes: IProductType[] = data.filter((item) => item._id !== slug);

      // Setting data on states

      if (singleCake) setSingleItem(singleCake);
      setAllItems(allCakes);
    }
  }, [data, slug]);

  if (isError) return <DataNotFound />;
  if (isLoading) return <CustomLoader />;
  if (!singleItem) return <DataNotFound />;

  return (
    <>
      <Divider />
      <div className="pt-6 lg:pt-7">
        <Container>
          <Breadcrumb name={singleItem.name} id={singleItem._id} />
          <ProductSingleDetails data={singleItem} />
        </Container>
      </div>

      <div className="px-5 mt-8 pt-4">
        <SectionHeader
          sectionHeading={'Explore more cakes'}
          headingPosition="center"
        />
        <Container>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-7 gap-3 md:gap-4 2xl:gap-5">
            {allItems?.map((product) => (
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
}

ProductPage.Layout = Layout;

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

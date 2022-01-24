import Layout from '@components/layout/layout-two';
import Container from '@components/ui/container';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import HeroBannerCard from '@components/hero/hero-banner-card';
import BestSellerGroceryProductFeed from '@components/product/feeds/best-seller-grocery-product-feed';
import { homeSixHeroBanner as heroBanner } from '@framework/static/banner';
import { GetStaticProps } from 'next';
import Seo from '@components/seo/seo';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';

import { useProductsQuery } from '@framework/product/get-all-products';
import { IProductType } from '@framework/types';
import { useEffect, useState } from 'react';
import ProductsCarousel from '@components/product/products-carousel';

export default function Home() {
  const { data, isLoading, isError, error } = useProductsQuery();
  const [normalProducts, setNormalProducts] = useState<IProductType[]>([]);
  const [salesProducts, setSalesProducts] = useState<IProductType[]>([]);

  useEffect(() => {
    const normalProductCntr: IProductType[] = [];
    const salesProductCntr: IProductType[] = [];

    data?.forEach((element) => {
      if (element.variations && element.variations.length > 0) {
        for (let index = 0; index < element.variations.length; index++) {
          const variation = element.variations[index];
          if (variation.discount && variation.discount > 0) {
            salesProductCntr.push(element);
            break;
          }
        }
      } else if (element.discount && element.discount > 0) {
        salesProductCntr.push(element);
      } else {
        normalProductCntr.push(element);
      }
    });

    setSalesProducts(salesProductCntr);
    setNormalProducts(normalProductCntr);
  }, [data]);

  return (
    <>
      <Seo title="CakeGhar" description="fresh cake in pokhara" path="/" />

      <HeroBannerCard
        banner={heroBanner}
        className="hero-banner-six min-h-[400px] md:min-h-[460px] lg:min-h-[500px] xl:min-h-[650px] py-20 py:pt-24 mb-5 2xl:bg-center"
      />

      <Container>
        <br />
        <ProductsCarousel
          sectionHeading={'Cakes in sale'}
          headingPostion="center"
          loading={isLoading}
          products={salesProducts}
          hideSeeAllBtn={true}
        />
        <BestSellerGroceryProductFeed
          data={normalProducts}
          isLoading={isLoading}
          isError={isError}
          error={error}
        />
      </Container>
    </>
  );
}

Home.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const queryClient = new QueryClient();

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      ...(await serverSideTranslations(locale!, [
        'common',
        'forms',
        'menu',
        'footer',
      ])),
    },

    revalidate: 60,
  };
};

import Layout from '@components/layout/layout';
import { useVerifyEmailMutation } from '@framework/auth/email-verification';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function EmailVerification() {
  const router = useRouter();
  const { slug } = router.query;
  const {
    mutate: verifyEmail,
    isLoading,
    isError,
    isIdle,
    isSuccess,
  } = useVerifyEmailMutation();

  useEffect(() => {
    if (slug) {
      verifyEmail(slug.toString());
    }
  }, [slug]);

  if (isIdle || isLoading)
    return <h1 className="text-center mt-3">Verifying email...</h1>;
  if (isError)
    return <h1 className="text-center mt-3">Invalid verification link!!!</h1>;
  if (isSuccess)
    return <h1 className="text-center mt-3">You are verified!!!</h1>;
  return <h1 className="text-center mt-3">Verifying email...</h1>;
}

EmailVerification.Layout = Layout;

export default EmailVerification;

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        'common',
        'forms',
        'menu',
        'terms',
        'faq',
        'footer',
      ])),
    },
  };
};

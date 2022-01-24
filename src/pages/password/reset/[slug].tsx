import Layout from '@components/layout/layout';
import PasswordInput from '@components/ui/form/password-input';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPaths, GetStaticProps } from 'next';
import Seo from '@components/seo/seo';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useResetPasswordMutation } from '@framework/auth/use-reset-password';
import Button from '@components/ui/button';
import Heading from '@components/ui/heading';

interface InputsType {
  newPassword: string;
  confirmPassword: string;
}

let jwt = require('jsonwebtoken');

export default function ResetUserPassword() {
  const { t } = useTranslation();
  const router = useRouter();
  const { slug } = router.query;
  const [isTokenVerified, setIsTokenVerified] = useState<boolean>(false);
  const { mutate: resetPassword, isLoading } = useResetPasswordMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<InputsType>();

  const verifyToken = () => {
    if (slug) {
      const data = jwt.decode(slug);
      if (data === null) {
        toast.error('Invalid token.');
        router.push('/');
        return;
      }
      setIsTokenVerified(true);
    }
  };

  useEffect(() => {
    verifyToken();
  }, [slug]);

  function onSubmit({ newPassword, confirmPassword }: InputsType) {
    if (newPassword !== confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Confirm passowrd does not match the password password.',
      });
      return;
    }
    resetPassword({ password: confirmPassword, token: `${slug}` });
  }

  if (!isTokenVerified) {
    return <h3 className="text-center mt-5">Loading</h3>;
  }

  return (
    <>
      <Seo
        title="Reset Password"
        description="Fastest E-commerce template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        path="my-account/address"
      />
      <div className="w-full flex h-full  flex-col mt-6 lg:mt-7">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex justify-center items-center py-30"
        >
          <div className="flex-row justify-center w-full sm:w-1/2 lg:w-1/3 px-1.5 md:px-2.5 py-4">
            <Heading variant="titleLarge">Reset Password</Heading>
            <PasswordInput
              label={'New Password'}
              {...register('newPassword', {
                required: 'This filed is required',
                pattern: {
                  value: /(?=.*\d)(?=.*[A-Za-z]).{6,}/,
                  message: t(
                    'Password must contain at least 6 or more characters including at least one number'
                  ),
                },
              })}
              error={errors.newPassword?.message}
              className="w-full mt-5"
            />

            <PasswordInput
              label={'Confirm Password'}
              {...register('confirmPassword', {
                required: 'This filed is required',
                pattern: {
                  value: /(?=.*\d)(?=.*[A-Za-z]).{6,}/,
                  message: t(
                    'Password must contain at least 6 or more characters including at least one number'
                  ),
                },
              })}
              error={errors.confirmPassword?.message}
              className="w-full mt-6"
            />
            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading}
              variant="formButton"
              className="w-full sm:w-auto mt-6"
            >
              Reset Password
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

ResetUserPassword.Layout = Layout;

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

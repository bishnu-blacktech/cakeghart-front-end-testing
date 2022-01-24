import Input from '@components/ui/form/input';
import Button from '@components/ui/button';
import Heading from '@components/ui/heading';
import { useForm } from 'react-hook-form';
import { useUpdateUserMutation } from '@framework/customer/use-update-customer';
import { useTranslation } from 'next-i18next';
import { UserType, useUserQuery } from '@framework/customer/get-user-details';

interface GenderOptionType {
  name: string;
  value: string;
}

const genderOption: GenderOptionType[] = [
  {
    name: 'Male',
    value: 'male',
  },
  {
    name: 'Female',
    value: 'female',
  },
  {
    name: 'Others',
    value: 'others',
  },
];

const AccountDetails: React.FC = () => {
  const { mutate: updateUser, isLoading } = useUpdateUserMutation();
  const { t } = useTranslation();
  const userData = useUserQuery();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserType>();

  function onSubmit(input: UserType) {
    updateUser(input);
  }

  if (userData?.isError) return <h1>Error......</h1>;
  if (userData?.isLoading) return <h2>Loading...</h2>;

  return (
    <div className="w-full flex flex-col">
      <Heading variant="titleLarge" className="mb-5 md:mb-6 lg:mb-7 lg:-mt-1">
        {t('common:text-account-details-personal')}
      </Heading>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-auto flex flex-col justify-center"
        noValidate
      >
        <div className="border-skin-base border-b pb-7 md:pb-8 lg:pb-10">
          <div className="flex flex-col space-y-4 sm:space-y-5">
            <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
              <Input
                label={t('forms:label-first-name')}
                {...register('firstName', {
                  required: 'forms:first-name-required',
                })}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                defaultValue={userData.data?.firstName}
                error={errors.firstName?.message}
              />
              <Input
                label={t('forms:label-last-name')}
                {...register('lastName', {
                  required: 'forms:last-name-required',
                })}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                defaultValue={userData.data?.lastName}
                error={errors.lastName?.message}
              />
            </div>
            <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
              <Input
                type="tel"
                label={t('forms:label-phone')}
                {...register('phone', {
                  required: 'forms:phone-required',
                  pattern: {
                    value: /[+][0-9]{10}|[0-9]{10}/,
                    message: t('Please provide a valid conact number'),
                  },
                })}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                defaultValue={userData.data?.phone}
                error={errors.phone?.message}
              />
              <Input
                type="date"
                label={t('Date of Birth')}
                {...register('dob', {
                  required: 'Date of birth is required',
                })}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                defaultValue={userData.data?.dob}
                error={errors.dob?.message}
              />
            </div>
            <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
              <div className="block font-normal text-sm leading-none mb-3 cursor-pointer  px-2 sm:px-2 md:px-3  w-full sm:w-1/2">
                <label
                  htmlFor="gender"
                  className="block font-normal text-sm leading-none mb-3 cursor-pointer"
                >
                  Gender *
                </label>
                <select
                  {...register('gender', {
                    required: 'Date of birth is required',
                  })}
                  defaultValue={
                    userData.data?.gender ? userData.data?.gender : 'others'
                  }
                  className="bg-skin-fill border rounded  px-3 w-full border-skin-two focus:border-2 focus:outline-none focus:border-skin-primary h-11 md:h-12"
                  {...register('gender', {
                    required: 'forms:phone-required',
                  })}
                >
                  {genderOption.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                type="email"
                label={t('forms:label-email-star')}
                {...register('email', {
                  required: 'forms:email-required',
                  pattern: {
                    value:
                      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: 'forms:email-error',
                  },
                })}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                defaultValue={userData.data?.email}
                error={errors.email?.message}
              />
            </div>
          </div>
        </div>

        <div className="relative flex sm:ms-auto mt-5 pb-2 lg:pb-0">
          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading}
            variant="formButton"
            className="w-full sm:w-auto"
          >
            {t('common:button-save-changes')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AccountDetails;

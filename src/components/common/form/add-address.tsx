import Input from '@components/ui/form/input';
import Button from '@components/ui/button';
import TextArea from '@components/ui/form/text-area';
import { useForm } from 'react-hook-form';
import { useModalAction } from '@components/common/modal/modal.context';
import CloseButton from '@components/ui/close-button';
import Heading from '@components/ui/heading';
import { useTranslation } from 'next-i18next';
import { useAddressQuery } from '@framework/address/address';
import {
  AddressType,
  useAddAddressMutation,
} from '@framework/address/use-add-address';
import { useModalState } from '@components/common/modal/modal.context';
import { useEffect, useState } from 'react';

interface ContactFormValues {
  title: string;
  description: string;
}

const AddAddressForm: React.FC = () => {
  const { data } = useModalState();
  const [allAddressData, setAllAddressData] = useState<AddressType[]>([]);
  const { t } = useTranslation();
  const { closeModal } = useModalAction();
  const userAddress = useAddressQuery();
  const { mutate: addNewAddress, isLoading } = useAddAddressMutation('ADD');
  const { mutate: updateAddress } = useAddAddressMutation('EDIT');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ContactFormValues>();

  // This is for removing address data from the address list

  useEffect(() => {
    if (data) {
      const normalizedData: AddressType[] = [];
      userAddress.data &&
        userAddress.data.forEach((element: AddressType) => {
          if (data.title !== element.title) {
            normalizedData.push(element);
          }
        });

      setAllAddressData(normalizedData);
    }
  }, [data, userAddress.data]);

  function onSubmit(values: ContactFormValues) {
    const addressContainer: AddressType[] = allAddressData;

    for (let index = 0; index < addressContainer.length; index++) {
      const element = addressContainer[index];
      if (
        element.title.toLowerCase().trim() === values.title.toLowerCase().trim()
      ) {
        setError('title', {
          type: 'manual',
          message: 'This title already exists',
        });
        return;
      }
    }

    // Update address

    if (data.title) {
      const addressData: AddressType[] = userAddress.data
        ? userAddress.data.map((item) => {
            if (item.title === data.title) {
              return {
                title: values.title.trim(),
                description: values.description.trim(),
              };
            }
            return item;
          })
        : [];

      updateAddress(addressData);
    }

    // add new address
    else {
      const addressData: AddressType[] = userAddress.data
        ? [...userAddress.data, values]
        : [values];

      addNewAddress(addressData);
    }
  }

  if (userAddress.isLoading) return <h1>Loading...</h1>;
  if (userAddress.isError) return <h1>Error ..</h1>;

  return (
    <div className="w-full md:w-[600px] lg:w-[900px] xl:w-[1000px] mx-auto p-5 sm:p-8 bg-skin-fill rounded-md">
      <CloseButton onClick={closeModal} />
      <Heading variant="title" className="mb-8 -mt-1.5">
        {t('common:text-add-delivery-address')}
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-6">
          <Input
            variant="solid"
            label="Address Title"
            {...register('title', {
              required: 'Title Required',
              pattern: {
                value: /^.{2,15}$/,
                message: t(
                  ' Title must have at least 2 characters and maximum 15 characters'
                ),
              },
            })}
            defaultValue={data?.title}
            error={errors.title?.message}
          />
        </div>
        <div className="grid grid-cols-1 mb-6 gap-7">
          <TextArea
            label="Address"
            {...register('description', {
              required: 'forms:address-required',
              pattern: {
                value: /^.{5,50}$/,
                message: t(
                  ' Description must have at least 5 characters and maximum 50 characters'
                ),
              },
            })}
            variant="solid"
            className="text-skin-base"
            defaultValue={data?.description}
            error={errors.description?.message}
          />
        </div>
        <div className="flex w-full justify-end">
          <Button className="h-11 md:h-12 mt-1.5" type="submit">
            {t('common:text-save-address')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddAddressForm;

import Input from '@components/ui/input';
import { useTranslation } from 'next-i18next';
import { AddressType } from '@framework/address/address';
import { useModalAction } from '@components/common/modal/modal.context';
import { toast } from 'react-toastify';

interface IProps {
  register: any;
  errors: any;
  data: any;
  address: AddressType[];
  isAuthorized: boolean;
}

interface IAddressType {
  label: string;
  value: string;
}

// Function to min or max date

function getDeliveryDate(type: 'min' | 'max') {
  const date = new Date();
  const minDate = `${date.getFullYear()}-${
    (date.getMonth() + 1).toString().length === 1
      ? `0${date.getMonth() + 1}`
      : date.getMonth() + 1
  }-${
    date.getDate().toString().length === 1
      ? `0${date.getDate()}`
      : date.getDate()
  }`;

  date.setDate(date.getDate() + 6);

  const maxDate = `${date.getFullYear()}-${
    (date.getMonth() + 1).toString().length === 1
      ? `0${date.getMonth() + 1}`
      : date.getMonth() + 1
  }-${
    date.getDate().toString().length === 1
      ? `0${date.getDate()}`
      : date.getDate()
  }`;

  if (type === 'min') return minDate;
  return maxDate;
}

// Get current date

const getCurrentDate = () => {
  const date = new Date();
  const currentDate = `${date.getFullYear()}-${
    date.getMonth() + 1 > 9 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`
  }-${date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`}`;

  return currentDate;
};

const getCurrentTime = () => {
  let date = new Date();
  let currentTime = date.getHours() + 1 + ':' + date.getMinutes();
  return currentTime;
};

const CheckoutForm: React.FC<IProps> = ({
  data,
  register,
  errors,
  isAuthorized,
  address: addressData,
}) => {
  const { t } = useTranslation();
  const { openModal } = useModalAction();
  const minDate = getDeliveryDate('min');
  const maxDate = getDeliveryDate('max');

  const address: IAddressType[] = [];
  addressData &&
    addressData.forEach((element) => {
      address.push({ label: element.title, value: element.description });
    });

  function handlePopupView(item: any) {
    if (address.length >= 5) {
      toast.error('You are not allowed to add more than 5 address.');
      return;
    }
    openModal('ADDRESS_VIEW_AND_EDIT', item);
  }

  return (
    <>
      {!isAuthorized && (
        <div className="w-full bg-red-300 text-white px-2 py-3 rounded">
          <h1>
            You are not logined. If you want to view your order details or
            cancel them, Please login!
          </h1>
        </div>
      )}

      <h2 className="text-lg md:text-xl xl:text-2xl font-bold text-heading mb-6 xl:mb-8 mt-3">
        {t('Shipping Address')}
      </h2>
      <div className="w-full mx-auto flex flex-col justify-center ">
        <div className="flex flex-col space-y-4 lg:space-y-5">
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
            <Input
              label={t('forms:label-first-name')}
              {...register('firstName', {
                required: t('forms:first-name-required'),
              })}
              defaultValue={data && data.firstName}
              error={errors.firstName?.message}
              variant="solid"
              className="w-full lg:w-1/2 "
            />
            <Input
              label={t('forms:label-last-name')}
              {...register('lastName', {
                required: t('forms:last-name-required'),
              })}
              defaultValue={data && data.lastName}
              error={errors.lastName?.message}
              variant="solid"
              className="w-full lg:w-1/2 lg:ms-3 mt-2 md:mt-0"
            />
          </div>
          {isAuthorized ? (
            <>
              <label
                htmlFor="gender"
                className="block text-sm leading-none mb-3 cursor-pointer font-bold"
              >
                Address *
              </label>

              <div className="flex space-x-3">
                <select
                  name="phone"
                  className="bg-skin-fill border rounded cursor-pointer px-3 w-full border-skin-two focus:border focus:outline-none focus:border-skin-primary h-11 md:h-12"
                  {...register('address')}
                >
                  {address.map((data, index) => (
                    <option
                      key={index}
                      value={data.value}
                      className="cursor-pointer"
                    >
                      {data.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="border px-4 rounded-md whitespace-nowrap bg-skin-primary text-white font-semibold"
                  onClick={handlePopupView}
                >
                  Add new address
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
              <Input
                type="tel"
                label={t('Address')}
                {...register('extraAddress', {
                  required: t('Address is required'),
                })}
                defaultValue={data && data.extraAddress}
                error={errors.extraAddress?.message}
                variant="solid"
                className="w-full"
              />
            </div>
          )}

          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
            <Input
              type="tel"
              label={t('forms:label-phone')}
              {...register('phone', {
                required: t('forms:phone-required'),
                pattern: {
                  value: /[+][0-9]{10}|[0-9]{10}/,
                  message: t('Please provide a valid conact number'),
                },
              })}
              defaultValue={data && data.phone}
              error={errors.phone?.message}
              variant="solid"
              className="w-full lg:w-1/2 "
            />

            <Input
              type="email"
              label={t('forms:label-email-star')}
              {...register('email', {
                pattern: {
                  value:
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: 'forms:email-error',
                },
              })}
              defaultValue={data && data.email}
              error={errors.email?.message}
              variant="solid"
              className="w-full lg:w-1/2 lg:ms-3 mt-2 md:mt-0"
            />
          </div>
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0">
            <Input
              type="date"
              label={t('Date *')}
              {...register('date', {
                required: 'Date is required',
              })}
              variant="solid"
              className="w-full lg:w-1/2 cursor-pointer"
              min={minDate}
              max={maxDate}
              style={{ cursor: 'pointer', userSelect: 'none' }}
              defaultValue={getCurrentDate()}
              error={errors.date?.message}
            />
            <Input
              type="time"
              label={t('Time *')}
              {...register('time', { required: 'Time is required' })}
              variant="solid"
              className="w-full lg:w-1/2 lg:ms-3 mt-2 md:mt-0 cursor-pointer"
              style={{ cursor: 'pointer' }}
              // min="10:00"
              // max="18:00"
              // defaultValue={getCurrentTime()}
              error={errors.time?.message}
            />
          </div>
          <div className="w-ful">
            <label
              htmlFor="instruction"
              className="block text-sm leading-none mb-3 cursor-pointer font-bold"
            >
              Instruction
            </label>
            <textarea
              className=" bg-skin-fill border rounded cursor-pointer px-3 w-full border-skin-two focus:border focus:outline-none focus:border-skin-primary h-[150px]"
              {...register('orderNotice')}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutForm;

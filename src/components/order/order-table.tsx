import { Table } from '@components/ui/table';
import Input from '@components/ui/form/input';
import { useEffect, useState } from 'react';
import Pagination from '@components/ui/pagination';
import ActionsButton from '@components/ui/action-button';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import { GrNext, GrPrevious } from 'react-icons/gr';
import { BsSearch } from 'react-icons/bs';
import { IOrderType } from '@framework/types';

interface IProps {
  orders: IOrderType[];
}

const OrderNumber: React.FC<{ orderNumber: any }> = ({ orderNumber }) => {
  return <p>#{orderNumber}</p>;
};

export const CreatedAt: React.FC<{ createdAt?: any }> = ({ createdAt }) => {
  dayjs.extend(relativeTime);
  dayjs.extend(utc);
  dayjs.extend(timezone);
  return (
    <span className="whitespace-nowrap">
      {dayjs.utc(createdAt).tz(dayjs.tz.guess()).fromNow()}
    </span>
  );
};

export const Status: React.FC<{ item?: any }> = ({ item }) => {
  return (
    <span className={item?.status?.name?.replace(/\s/g, '_').toLowerCase()}>
      <span
        className="bullet"
        style={{ backgroundColor: item?.status?.color }}
      />
      {item?.status}
    </span>
  );
};

const DeliveryDatetime: React.FC<{ date: any; time: any }> = ({
  date,
  time,
}) => {
  return (
    <p>
      {date}-{time}
    </p>
  );
};

const TotalPrice: React.FC<{ totalPrice: any }> = ({ totalPrice }) => {
  return <p>Rs. {totalPrice}</p>;
};

const columns = [
  {
    title: 'Order Number',
    key: 'tracking_number',
    className: 'id-cell',
    render: function setOrderNumber(items: any) {
      return <OrderNumber orderNumber={items.orderId} />;
    },
  },
  {
    title: 'Order Date',
    dataIndex: 'createdAt',
    key: 'created_at',
    render: function createdAt(items: any) {
      return <CreatedAt createdAt={items} />;
    },
  },
  {
    title: 'Status',
    key: 'status',
    render: function status(item: any) {
      return <Status item={item} />;
    },
  },
  {
    title: 'Delivery Date&Time',
    key: 'delivery_time',
    render: function deliveryDateAndtime(items: any) {
      return <DeliveryDatetime date={items.due.date} time={items.due.time} />;
    },
  },
  {
    title: 'Total Price',
    key: 'total',
    render: function totalPrice(items: any) {
      return <TotalPrice totalPrice={items.totalPrice} />;
    },
  },
  {
    dataIndex: '',
    key: 'operations',
    render: function actionsButton(item: any) {
      return <ActionsButton item={item} />;
    },
    className: 'operations-cell',
  },
];

const OrderTable: React.FC<IProps> = ({ orders }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [value, setValue] = useState('');
  const countPerPage = 5;
  let [filterData, setDataValue] = useState<IOrderType[]>(
    orders.slice(0, countPerPage)
  );

  useEffect(() => {
    setDataValue(orders.slice(0, countPerPage));
  }, [orders]);

  const updatePage = (p: any) => {
    setCurrentPage(p);
    const to = countPerPage * p;
    const from = to - countPerPage;
    setDataValue(orders.slice(from, to));
  };

  const onChangeSearch = (e: any) => {
    setCurrentPage(1);

    if (!e.target.value) {
      setDataValue(orders.slice(0, countPerPage));
      setValue(e.target.value);
      return;
    }

    let filter: any = orders
      .filter((item) => item.orderId.toString() === e.target.value)
      .slice(0, countPerPage);

    setValue(e.target.value);

    if (!e.target.value) {
      updatePage(1);
    }
    setDataValue(filter);
  };

  const onSubmitHandle = (e: any) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="md:flex md:justify-between items-center mb-5 sm:mb-10">
        <h2 className="font-semibold text-sm md:text-xl text-skin-base mb-4 md:mb-0">
          My order list
        </h2>
        <form onSubmit={onSubmitHandle} className="relative">
          <span className="absolute end-3 top-[80%] transform -translate-y-1/2 order-icon-color">
            <BsSearch size={19} />
          </span>
          <Input
            name="search"
            type="number"
            value={value}
            onChange={onChangeSearch}
            placeholder="Search Order list"
            inputClassName=" h-[46px] w-full placeholder-[rgba(0, 0, 0, .3)] bg-white border border-[#E3E8EC] rounded-md order-search focus:border-2 focus:outline-none focus:border-skin-primary"
          />
        </form>
      </div>

      <div className="order-list-table-wraper">
        <Table
          className="order-list-table"
          columns={columns}
          data={filterData}
          rowKey="id"
        />
      </div>

      {!value.trim() && (
        <div className="text-end mt-5">
          <Pagination
            current={currentPage}
            onChange={updatePage}
            pageSize={countPerPage}
            total={orders?.length}
            prevIcon={<GrPrevious size={12} style={{ color: '#090B17' }} />}
            nextIcon={<GrNext size={12} style={{ color: '#090B17' }} />}
            className="order-table-pagination"
          />
        </div>
      )}
    </>
  );
};

export default OrderTable;

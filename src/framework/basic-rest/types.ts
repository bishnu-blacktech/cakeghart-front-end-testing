import { QueryKey } from 'react-query';

export type CollectionsQueryOptionsType = {
  text?: string;
  collection?: string;
  status?: string;
  limit?: number;
};

export type CategoriesQueryOptionsType = {
  text?: string;
  category?: string;
  status?: string;
  limit?: number;
};
export type ProductsQueryOptionsType = {
  type: string;
  text?: string;
  category?: string;
  status?: string;
  limit?: number;
};
export type QueryOptionsType = {
  text?: string;
  category?: string;
  status?: string;
  limit?: number;
};

export type QueryParamsType = {
  queryKey: QueryKey;
  pageParam?: string;
};
export type Attachment = {
  id: string | number;
  thumbnail: string;
  original: string;
};
export type Category = {
  id: number | string;
  name: string;
  slug: string;
  details?: string;
  image?: Attachment;
  icon?: string;
  children?: [Category];
  products?: Product[];
  productCount?: number;
  [key: string]: unknown;
};
export type Collection = {
  id: number | string;
  name: string;
  slug: string;
  details?: string;
  image?: Attachment;
  icon?: string;
  products?: Product[];
  productCount?: number;
};
export type Brand = {
  id: number | string;
  name: string;
  slug: string;
  image?: Attachment;
  [key: string]: unknown;
};
export type Dietary = {
  id: number | string;
  name: string;
  slug: string;
  [key: string]: unknown;
};
export type Tag = {
  id: string | number;
  name: string;
  slug: string;
};

export type Product = {
  id: number | string;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  sold: number;
  unit: string;
  sale_price?: number;
  min_price?: number;
  max_price?: number;
  image: Attachment;
  sku?: string;
  gallery?: Attachment[];
  category?: Category;
  tag?: Tag[];
  meta?: any[];
  brand?: Brand;
  description?: string;
  variations?: object;
  [key: string]: unknown;
};

export type OrderItem = {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
};
export type Order = {
  id: string | number;
  name: string;
  slug: string;
  products: OrderItem[];
  total: number;
  tracking_number: string;
  customer: {
    id: number;
    email: string;
  };
  shipping_fee: number;
  payment_gateway: string;
};

export type ShopsQueryOptionsType = {
  text?: string;
  shop?: Shop;
  status?: string;
  limit?: number;
};

export type Shop = {
  id: string | number;
  owner_id: string | number;
  owner_name: string;
  address: string;
  phone: string;
  website: string;
  ratings: string;
  name: string;
  slug: string;
  description: string;
  cover_image: Attachment;
  logo: Attachment;
  socialShare: any;
  created_at: string;
  updated_at: string;
};

// @ bishnu thapa

// new product type

export type IVariantionType = {
  _id: number | string;
  size: string;
  price: number;
  discount: number | null;
};

export type IProductType = {
  _id: string | number;
  itemId: string | number;
  name: string;
  price: number | null;
  unit: string;
  salePrice?: number | null;
  discount: number | null;
  images: string[];
  variations: IVariantionType[];
  description: string | null;
  categories: string[];
};

export type IWishListType = {
  id: number | string;
  name: string;
  price: number | null;
  image: any;
  unit: string;
};

export type IMobileSearchType = {
  _id: string | number;
  name: string;
  image: string;
};

export type IProductWithRelatedProductsType = {
  item: IProductType;
  relatedItems: IProductType[];
};

// order section

export interface IOrderDateType {
  date: string;
  time: string;
}

export interface IOrderNameType {
  first: string;
  last: string;
}

export interface IOrderItemType {
  name: string;
  images: string[];
  unit: string;
  price: number;
  discount: number;
  quantity: string;
}

export interface IOrderType {
  name: IOrderNameType;
  due: IOrderDateType;
  _id: string;
  orderId: number;
  userId: string;
  email: string;
  phone: string;
  products: IOrderItemType[];
  location: string;
  status: string;
  notice: string;
  paymentStatus: string;
  totalPrice: string;
}

export type IDeliveryDataType = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  extraAddress?: string;
  date: Date;
  time: string;
  email: string;
  orderNotice: string;
};

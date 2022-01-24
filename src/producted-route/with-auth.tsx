import { getToken } from '@framework/utils/get-token';

const withAuth = (Component: any) => {
  if (!getToken()) {
    return <h1>Hello</h1>;
  }

  return <h1>Hey----------- success</h1>;
};

export default withAuth;

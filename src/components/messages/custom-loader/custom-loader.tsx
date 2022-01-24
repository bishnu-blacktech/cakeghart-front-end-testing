import { css } from '@emotion/react';
import ClipLoader from 'react-spinners/ClipLoader';

const override = css`
  display: block;
  margin: 50px auto;
  border-color: red;
`;

function CustomLoader() {
  return (
    <div style={{ padding: '50px 0' }}>
      <ClipLoader loading={true} css={override} size={100} />
    </div>
  );
}

export default CustomLoader;

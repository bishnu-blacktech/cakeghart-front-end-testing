import noDataImage from './something-went-wrong.png';
import Image from 'next/image';

interface Props {
  message?: string;
}

const SomethingWentWrong = ({ message }: Props) => {
  return (
    <div style={{ padding: '50px 0' }}>
      <div
        style={{
          maxWidth: '280px',
          margin: 'auto',
          padding: ' 0 20px',
        }}
      >
        <Image src={noDataImage} alt="Awesome image" />
        <p className="text-center p-0">
          {message ? message : 'OOPS, something went worng!!!'}
        </p>
      </div>
    </div>
  );
};

export default SomethingWentWrong;

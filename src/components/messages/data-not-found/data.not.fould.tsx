import noDataImage from './no-data.png';
import Image from 'next/image';

interface Props {
  message?: string;
}

const DataNotFound = ({ message }: Props) => {
  return (
    <div style={{ padding: '50px 0' }}>
      <div style={{ maxWidth: '280px', margin: 'auto', padding: ' 0 20px' }}>
        <Image src={noDataImage} alt="Awesome image" />
        <p className="text-center">{message ? message : 'Data not found!!!'}</p>
      </div>
    </div>
  );
};

export default DataNotFound;

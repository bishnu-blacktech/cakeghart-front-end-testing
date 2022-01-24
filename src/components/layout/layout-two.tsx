import { useSessionStorage } from 'react-use';
import Image from '@components/ui/image';
import HighlightedBar from '@components/common/highlighted-bar';
import Countdown from '@components/common/countdown';
import Header from '@components/layout/header/header-two';
import Footer from '@components/layout/footer/footer';
import MobileNavigation from '@components/layout/mobile-navigation/mobile-navigation';
import { useTranslation } from 'next-i18next';

const Layout: React.FC = ({ children }) => {
  const { t } = useTranslation('common');
  const [highlightedBar, setHighlightedBar] = useSessionStorage(
    'CakeGhar-highlightedBar',
    'false'
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* {highlightedBar !== 'true' && (
        <HighlightedBar onClose={() => setHighlightedBar('true')}>
          <div className="flex items-center">
            <div className="hidden sm:flex flex-shrink-0 items-center justify-center bg-skin-fill w-9 h-9 rounded-full me-2.5">
              <Image
                width={23}
                height={23}
                src="/assets/images/delivery-box.svg"
                alt="Delivery Box"
              />
            </div>
            <p
              dangerouslySetInnerHTML={{
                __html: t('text-highlighted-bar'),
              }}
            />
          </div>
          <Countdown date={Date.now() + 4000000 * 71} />
        </HighlightedBar>
      )} */}
      {/* End of highlighted bar  */}

      <Header />
      <main
        className="relative flex-grow"
        style={{
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </main>
      <Footer />
      <MobileNavigation />
    </div>
  );
};

export default Layout;

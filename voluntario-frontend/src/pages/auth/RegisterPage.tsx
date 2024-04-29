import { LogoLink } from '@/components/icons/Logo';
import { Link, Outlet } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

export const RegisterPage = () => {
  const isSmallScreen = useMediaQuery({
    maxDeviceWidth: 768,
  });

  const gradient =
    'md:bg-gradient-to-tr md:from-green-500 md:via-green-500 md:to-green-300';

  return (
    <div className="mx-auto flex h-dvh flex-row">
      {!isSmallScreen && (
        <>
          <div className={`m-0 h-dvh basis-1/3 ${gradient}`}></div>
          <div className="h-max basis-2/3"></div>
        </>
      )}

      <div className="absolute left-1/2 w-4/5 -translate-x-1/2 pb-20 md:w-1/2">
        <LogoLink to="/home" size="md" className="mx-auto w-24 md:w-48" />
        <div className="rounded-sm bg-white px-8 py-10 md:border-2">
          <Outlet />

          <p className="my-4 text-center align-middle">
            Masz już konto?{' '}
            <span>
              <Link to={'/login'} className="text-link">
                Zaloguj się
              </Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

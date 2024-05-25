import { LogoLink } from '@/components/ui/Logo';
import { Link } from 'react-router-dom';

export const AccountTypePage = () => {
  const gradient =
    'md:bg-gradient-to-tr md:from-green-500 md:via-green-500 md:to-green-300';

  return (
    <div className="mx-auto flex h-lvh flex-row items-center justify-center overflow-y-scroll">
      <div
        className={`mt-4 hidden md:visible md:m-0 md:flex md:h-screen md:w-1/4 md:basis-1/3 md:flex-col md:items-center md:justify-center ${gradient}`}
      ></div>
      <div className="w-3/4 max-md:max-w-sm md:w-1/2 md:basis-2/3"></div>

      <div className="fixed w-4/5">
        <LogoLink to="/home" size="lg" className="mx-auto w-24 md:w-48" />
        <h1 className="w-full text-center align-middle text-2xl font-bold md:text-4xl">
          Wybierz typ konta
        </h1>
        <div className="mx-auto mt-8 flex flex-col items-center gap-2 md:flex-row md:justify-evenly">
          <Link to="/register/volunteer">
            <div className="aspect-square w-48 bg-blue-700 md:w-64">
              Wolontariusz
            </div>
          </Link>
          <Link to="/register/organization">
            <div className="aspect-square w-48 bg-red-700 md:w-64">
              Organizacja
            </div>
          </Link>
        </div>
        <p className="my-4 text-center align-middle">
          Masz już konto?{' '}
          <span>
            <Link to={'/login'} className="text-link">
              Zaloguj się
            </Link>
          </span>
        </p>
      </div>
      {/* <div className="fixed left-0 right-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0">
        <div className="relative max-h-full w-full max-w-md p-4"></div>
      </div> */}
    </div>
  );
};
import { Link } from 'react-router-dom';

export const RegisterPage = () => {
  const gradient =
    'md:bg-gradient-to-tr md:from-green-500 md:via-green-500 md:to-green-300';

  return (
    <div className="mx-auto flex h-screen flex-col items-center justify-center md:flex-row">
      <div
        className={`mt-4 md:m-0 md:flex md:h-screen md:w-1/4 md:basis-1/3 md:flex-col md:items-center md:justify-center ${gradient}`}
      ></div>
      <div className="w-3/4 max-md:max-w-sm md:w-1/2 md:basis-2/3"></div>
      <div className="fixed w-4/5">
        <h1 className="w-full text-center align-middle text-4xl">
          Wybierz typ konta
        </h1>
        <div className="mx-auto mt-8 flex justify-evenly">
          <Link to="/register/volunteer">
            <div className="aspect-square w-64 bg-blue-700">Wolontariusz</div>
          </Link>
          <Link to="/register/organization">
            <div className="aspect-square w-64 bg-red-700">Organizacja</div>
          </Link>
        </div>
      </div>
      {/* <div className="fixed left-0 right-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0">
        <div className="relative max-h-full w-full max-w-md p-4"></div>
      </div> */}
    </div>
  );
};

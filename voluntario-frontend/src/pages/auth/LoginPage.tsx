import { LoginForm } from '@/components/forms/LoginForm';
import { LogoLink } from '@/components/icons/Logo';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const LoginPage = () => {
  const gradient =
    'md:bg-gradient-to-tl md:from-green-500 md:via-green-500 md:to-green-300';

  return (
    <div className="flex h-screen flex-col items-center md:flex-row">
      <div className="flex w-3/4 flex-col items-center gap-4 max-md:max-w-sm md:w-1/2 md:basis-2/3 md:gap-4">
        <LogoLink to="/" size="lg" className="my-4 w-24 md:my-8 md:w-48" />
        <h1 className="text-2xl font-bold md:text-4xl">Zaloguj się</h1>
        <LoginForm className="md:mx-auto md:w-1/2 md:max-w-sm" />
      </div>
      <div
        className={`mt-8 md:m-0 md:flex md:h-screen md:w-1/4 md:basis-1/3 md:flex-col md:items-center md:justify-center ${gradient}`}
      >
        <h1 className="text-center align-middle md:text-4xl">
          Nie masz konta?
        </h1>
        <Button
          className="mt-2 md:mt-8 md:w-48"
          // onClick={() => console.log('Register')}
          variant={'secondary'}
          asChild
        >
          <Link to={'/register'} className="">
            {' '}
            Zarejestruj się
          </Link>
        </Button>
      </div>
    </div>
  );
};

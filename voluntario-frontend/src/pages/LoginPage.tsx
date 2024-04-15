import { LoginForm } from '@/components/forms/LoginForm';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const LoginPage = () => {
  const gradient =
    'md:bg-gradient-to-tl md:from-green-500 md:via-green-500 md:to-green-300';

  return (
    <div className="mx-auto flex h-screen flex-col items-center justify-center md:flex-row">
      <div className="w-3/4 max-md:max-w-sm md:w-1/2 md:basis-2/3">
        <LoginForm className="md:mx-auto md:w-1/2 md:max-w-sm" />
      </div>
      <div
        className={`mt-4 md:m-0 md:flex md:h-screen md:w-1/4 md:basis-1/3 md:flex-col md:items-center md:justify-center ${gradient}`}
      >
        <p className="font-roboto text-center align-middle md:text-4xl">
          Nie masz konta?
        </p>
        <Button
          className="md:mt-8 md:w-48"
          onClick={() => console.log('Register')}
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

{
  /* <div className="mx-auto flex h-screen w-screen flex-col items-center justify-center justify-items-center md:flex-row md:justify-around">
  <div className="w-4/5 max-w-sm md:basis-2/3">
    <LoginForm className="" />
  </div>
  <div className="mt-4 md:basis-1/3">
    <p className="text-center align-middle">
      Don't have an account?{' '}
      <Link to={'/register'} className="text-blue-600">
        Register
      </Link>
    </p>
  </div>
</div>; */
}

{
  /* <div className="mx-auto flex h-screen items-center justify-center">
  <div className="flex flex-col content-center justify-stretch gap-3 md:w-full md:flex-row">
    <div className="flex content-center items-center justify-center md:basis-3/4">
      <LoginForm className="max-w-sm md:w-1/2" />
    </div>
  </div>
</div>; */
}

{
  /* <p className="mt-5 text-center">
  Don't have an account?{' '}
  <Link to={'/register'} className="text-blue-600">
    Register
  </Link>
</p> */
}

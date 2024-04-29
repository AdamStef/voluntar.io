import RegisterForm from '@/components/forms/RegisterVolunteerForm';
import { LogoLink } from '@/components/icons/Logo';
import { Link } from 'react-router-dom';

export const RegisterVolunteerPage = () => {
  return (
    <div className="flex h-screen flex-col items-center gap-2 md:gap-4">
      <LogoLink to="/home" className="my-4 w-24 md:w-48" />
      <h1 className="text-2xl font-bold md:text-4xl">Zarejestruj się</h1>
      <h2>
        Typ konta: Wolontariusz{' '}
        <span>
          <Link to={'/register'} className="text-link underline">
            Zmień
          </Link>
        </span>
      </h2>
      <RegisterForm className="w-3/4" />
      <p className="my-4 text-center align-middle">
        Masz już konto?{' '}
        <span>
          <Link to={'/login'} className="text-link">
            Zaloguj się
          </Link>
        </span>
      </p>
    </div>
  );
};

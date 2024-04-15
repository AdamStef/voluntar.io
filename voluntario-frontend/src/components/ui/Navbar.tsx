import { Button } from './button';
import React, { useState } from 'react';
import Hamburger from 'hamburger-react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { NavbarItemType } from '@/types';
import { Logo } from './Logo';
import { FaSpinner } from 'react-icons/fa';
// import { FaSpinner } from 'react-icons/fa';

const navItems: NavbarItemType[] = [
  {
    name: 'Home',
    path: '/home',
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
  },
  {
    name: 'Contact',
    path: '/contact',
  },
];

// const navButtons: NavButtonType[] = [
//   {
//     name: 'Login',
//     path: '/login',
//     onClick: () => console.log('Login'),
//   },
//   {
//     name: 'Register',
//     path: '/register',
//     onClick: () => console.log('Login'),
//   },
// ];

// type NavButtonType = NavbarItemType & {
//   onClick: () => void;
// };

// type NavbarProps = {
//   navLinks: NavbarItemType[];
//   navButtons: NavButtonType[];
//   // Item: React.FC;
// };

type MobileNavbarItemProps = {
  name: string;
  path: string;
  setShowNavbar: (showNavbar: boolean) => void;
};

const NavbarItem: React.FC<NavbarItemType> = ({ name, path }) => {
  return (
    <li key={name} className="cursor-pointer hover:text-primary">
      <NavLink
        to={path}
        className={({ isActive }) => {
          return isActive ? 'text-primary' : 'text-secondary';
        }}
      >
        {name}
      </NavLink>
    </li>
  );
};

const MobileNavbarItem: React.FC<MobileNavbarItemProps> = ({
  name,
  path,
  setShowNavbar,
}) => {
  return (
    <NavLink
      className={({ isActive }) => {
        return isActive ? 'bg-secondary text-white' : '';
      }}
      to={path}
      onClick={() => setShowNavbar(false)}
    >
      <li key={name} className="cursor-pointer py-8 text-center align-middle">
        {name}
      </li>
    </NavLink>
  );
};

const Navbar: React.FC = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  const { user, logout, isLoading } = useAuth();
  // const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  const handleLogout = () => {
    // setIsLoading(true);
    logout();
    // .then(() => {
    //   console.log('Logged out: ' + isLoading);
    //   setIsLoading(false); // TODO: This is not working
    // });
    setShowNavbar(false);
    // setIsLoading(false);
  };

  return (
    <nav className="relative flex h-24 items-center justify-between shadow-md">
      <Link to="/home">
        <div className="ml-4 flex w-1/4 items-center justify-between gap-2 md:ml-8">
          <Logo />
          <h1 className="text-xl font-bold text-primary md:text-2xl">
            Voluntar.io
          </h1>
        </div>
      </Link>
      <div className="mr-8 hidden items-center md:flex lg:mr-24">
        <ul className="mr-8 flex justify-between gap-8 text-lg text-secondary">
          {navItems.map((item) => (
            <NavbarItem key={item.name} name={item.name} path={item.path} />
          ))}
        </ul>
        {/* {navButtons.map((item) => (
          <Button key={item.name} onClick={item.onClick}>
            {item.name}
          </Button>
        ))} */}
        <Button onClick={handleLogout}>Wyloguj się</Button>
      </div>

      <div className="mr-4 block md:hidden">
        <Hamburger toggled={showNavbar} toggle={handleShowNavbar} />
      </div>
      <div
        className={
          showNavbar
            ? 'fixed left-0 top-0 h-full w-[60%] border-r border-r-gray-900 bg-[#65b465] duration-500 ease-in-out md:hidden'
            : 'fixed bottom-0 left-[-100%] top-0 w-[60%] duration-500 ease-in-out'
        }
      >
        <div className="flex h-screen flex-col justify-between">
          <ul className="flex flex-col divide-y">
            {navItems.map((item) => (
              <MobileNavbarItem
                key={item.name}
                name={item.name}
                path={item.path}
                setShowNavbar={setShowNavbar}
              />
            ))}
          </ul>
          {/* <div className="flex flex-col items-center justify-center">
            {navButtons.map((item) => (
              <Button
                key={item.name}
                onClick={item.onClick}
                variant={'secondary'}
              >
                {item.name}
              </Button>
            ))}
          </div> */}
          {user != null ? (
            <Button
              onClick={handleLogout}
              variant={'secondary'}
              className="m-4"
            >
              {isLoading ?? <FaSpinner className="mr-2 animate-spin" />}
              Wyloguj się
            </Button>
          ) : (
            <>
              <div className="m-4 flex flex-col gap-2">
                <Button variant={'secondary'} asChild>
                  <Link to={'/login'}>Zaloguj się</Link>
                </Button>
                <Button variant={'secondary'} asChild>
                  <Link to={'/register'}>Zarejestruj się</Link>
                </Button>
              </div>
            </>
          )}
          {/* // <Button
          //   onClick={handleLogout}
          //   variant={'secondary'}
          //   className="mx-4 mb-8"
          // >
          //   {isLoading ?? <FaSpinner className="mr-2 animate-spin" />}
          //   Wyloguj się
          // </Button> */}
        </div>
      </div>
    </nav>
  );
};

// Navbar.Item = NavbarItem;

export { Navbar };

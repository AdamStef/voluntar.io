import Logo from '@/assets/Logo.svg';
import { Button } from './button';
import { useState } from 'react';
import Hamburger from 'hamburger-react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

type NavItem = {
  name: string;
  path: string;
};

const navItems: NavItem[] = [
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

export const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  const { logout } = useAuth();

  const handleShowNavbar = () => {
    setShowNavbar(!showNavbar);
  };

  const handleLogout = () => {
    console.log('Logout user');
    logout();
  };

  return (
    <nav className="relative flex h-24 items-center justify-between shadow-md">
      <Link to="/home">
        <div className="ml-8 flex w-1/4 items-center justify-between gap-2">
          <img src={Logo} alt="Logo" className="aspect-square w-24" />
          <h1 className="text-2xl font-bold text-primary">Voluntar.io</h1>
        </div>
      </Link>
      <div className="mr-8 hidden items-center md:flex lg:mr-24">
        <ul className="mr-8 flex justify-between gap-8 text-lg text-secondary">
          {navItems.map((item) => (
            <li
              key={item.name}
              className="hover:text- cursor-pointer hover:text-primary"
            >
              <NavLink to={item.path}>{item.name}</NavLink>
            </li>
          ))}
        </ul>
        <Button onClick={handleLogout}>Wyloguj się</Button>
      </div>

      <div className="block md:hidden">
        <Hamburger toggled={showNavbar} toggle={handleShowNavbar} />
      </div>
      <div
        className={
          showNavbar
            ? 'fixed left-0 top-0 h-full w-[60%] border-r border-r-gray-900 bg-[#65b465] duration-500 ease-in-out md:hidden'
            : 'fixed bottom-0 left-[-100%] top-0 w-[60%] duration-500 ease-in-out'
        }
      >
        <ul className="flex h-screen flex-col justify-between">
          <div className="flex flex-col space-y-8 divide-y">
            {navItems.map((item) => (
              <NavLink
                // className={({ isActive }) => (isActive ? 'text-white' : '')}
                to={item.path}
              >
                <li
                  key={item.name}
                  className="cursor-pointer pt-8 text-center align-middle"
                >
                  {item.name}
                </li>
              </NavLink>
            ))}
          </div>
          <Button
            onClick={handleLogout}
            variant={'secondary'}
            className="mx-4 mb-8"
          >
            Wyloguj się
          </Button>
        </ul>
      </div>
    </nav>
  );
};

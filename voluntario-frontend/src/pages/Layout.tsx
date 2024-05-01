import { Navbar } from '@/components/navbars/Navbar';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <Outlet />
      {/* <footer className="h-24"></footer> */}
    </>
  );
};

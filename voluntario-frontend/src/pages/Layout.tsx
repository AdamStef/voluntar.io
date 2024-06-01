import { Navbar } from '@/components/navbars/Navbar';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      {/* <div className="bg-gray-100"> */}
      <Outlet />
      {/* </div> */}
      <footer className="pt-24"></footer>
    </>
  );
};

import { Navbar } from '@/components/ui/Navbar';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <Outlet />
      </main>
      {/* <footer>
        <p>Footer</p>
      </footer> */}
    </>
  );
};

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Link, Outlet } from 'react-router-dom';

export const Layout = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    console.log('Logout user');
    logout();
  };

  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <Link to={'/dashboard'}>Dashboard</Link>
            </li>
            <li>About</li>
            <li>Contact</li>
          </ul>
          <Button onClick={handleLogout}>Logout</Button>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>Footer</p>
      </footer>
    </>
  );
};

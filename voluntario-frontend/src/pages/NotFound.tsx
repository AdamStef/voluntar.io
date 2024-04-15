import { Navbar } from '@/components/ui/Navbar';
import { FaFrown } from 'react-icons/fa';

export const NotFound = () => {
  return (
    <>
      <Navbar />
      <div className="flex h-screen flex-col items-center justify-center">
        <FaFrown className="mx-auto size-32 text-muted-foreground md:size-72" />
        <div>
          <h1 className="text-4xl">404</h1>
          <h2 className="text-xl">Strona nie znaleziona</h2>
          <p className="text-muted-foreground">
            Strona na którą próbujesz wejść nie istnieje.
          </p>
        </div>
      </div>
    </>
  );
};

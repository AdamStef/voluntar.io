import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getLeaderboard } from '@/utils/api/api';
import { useQuery } from '@tanstack/react-query';
import { FaStar } from 'react-icons/fa';

export const Leaderboard = () => {
  const { data: pages } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: async () => getLeaderboard(),
  });

  if (!pages) return <p>Brak użytkowników w rankingu.</p>;

  return (
    <Table className="border shadow-lg">
      <TableHeader>
        <TableRow>
          <TableHead>Pozycja</TableHead>
          <TableHead>Nazwa użytkownika</TableHead>
          <TableHead>Ocena</TableHead>
          <TableHead>Punkty</TableHead>
          <TableHead>Liczba wolontariatów</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pages.content.map((user, index) => (
          <TableRow
            key={index}
            className={`hover:bg-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}`}
          >
            <TableCell>{index + 1}</TableCell>
            <TableCell>{user.fullName}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <FaStar color="gold" size={24} />
                <p>{user.rating}</p>
              </div>
            </TableCell>
            <TableCell>{user.points}</TableCell>
            <TableCell>{user.numberOfCompletedEvents}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

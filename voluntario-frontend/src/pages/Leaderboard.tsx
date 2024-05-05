import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FaStar } from 'react-icons/fa';

type LeaderboardUser = {
  username: string;
  rating: number;
  points: number;
  volunteerCount: number;
};

const users: LeaderboardUser[] = [
  {
    username: 'user1',
    rating: 4.5,
    points: 100,
    volunteerCount: 5,
  },
  {
    username: 'user2',
    rating: 4.0,
    points: 90,
    volunteerCount: 4,
  },
  {
    username: 'user3',
    rating: 3.5,
    points: 80,
    volunteerCount: 3,
  },
  {
    username: 'user4',
    rating: 3.0,
    points: 70,
    volunteerCount: 2,
  },
  {
    username: 'user5',
    rating: 2.5,
    points: 60,
    volunteerCount: 1,
  },
];

export const Leaderboard = () => {
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
        {users.map((user, index) => (
          <TableRow
            key={index}
            className={`hover:bg-gray-200 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'}`}
          >
            <TableCell>{index + 1}</TableCell>
            <TableCell>{user.username}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <FaStar color="gold" size={24} />
                <p>{user.points}</p>
              </div>
            </TableCell>
            <TableCell>{user.points}</TableCell>
            <TableCell>{user.volunteerCount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

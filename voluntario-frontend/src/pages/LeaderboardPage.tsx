import { H3 } from '@/components/ui/typography/heading';
import { Leaderboard } from '../components/ranking/Leaderboard';

export const LeaderboardPage = () => {
  return (
    <div className="container mt-5 max-w-4xl">
      <H3 className="mb-5">Ranking wolontariuszy</H3>
      <Leaderboard />
    </div>
  );
};

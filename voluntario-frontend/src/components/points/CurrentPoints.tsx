export const CurrentPoints = ({ points }: { points: number }) => {
  return (
    <div className="inline-flex h-40 w-40 items-center justify-center rounded-full bg-primary text-4xl font-bold text-primary-foreground shadow-lg">
      {points}
    </div>
  );
};

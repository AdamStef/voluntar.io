import { cn } from '@/lib/utils';

type Props = {
  className?: string;
};

export const EventFilters = ({ className }: Props) => {
  return (
    <div className={cn('rounded border', className)}>
      <h2 className="font-semibold">Filtry:</h2>
      <hr />
      <div>
        <label htmlFor="date">Data:</label>
        <input type="date" id="date" />
      </div>
      <div>
        <label htmlFor="city">Miasto:</label>
        <input type="text" id="city" />
      </div>
      <div>
        <label htmlFor="category">Kategoria:</label>
        <select id="category">
          <option value="all">Wszystkie</option>
          <option value="sport">Sport</option>
          <option value="charity">Charytatywne</option>
          <option value="music">Muzyka</option>
        </select>
      </div>
    </div>
  );
};

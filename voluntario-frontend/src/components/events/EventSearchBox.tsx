import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { useAppDispatch } from '@/utils/context/store';
import { SearchSlice } from '@/utils/context/searchSlice';

export const EventSearchBox = () => {
  const dispatch = useAppDispatch();
  return (
    <div className="flex h-32 w-full justify-center bg-[#F7F7F7] md:h-64">
      <div className="flex h-full w-4/5 max-w-xl flex-col justify-center">
        <h2 className="text-lg font-semibold">Wyszukaj:</h2>
        <div className="flex items-center py-2">
          <Input
            className="rounded-e-none"
            onChange={(e) => {
              dispatch({
                type: SearchSlice.actions.setSearch.type,
                payload: e.target.value,
              });
            }}
            placeholder="Wyszukaj wydarzenie"
          />
          {/* TODO: fix search button */}
          <div className="flex aspect-square h-full scale-105 items-center justify-center bg-primary">
            <Search color="white" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

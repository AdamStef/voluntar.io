import { Search } from 'lucide-react';
import { Input } from '../ui/input';
import { useAppDispatch } from '@/utils/context/store';
import { setSearch } from '@/utils/context/searchSlice';
import { useDebouncedCallback } from 'use-debounce';

export const EventSearchBox = () => {
  const dispatch = useAppDispatch();
  const deboundedSearch = useDebouncedCallback((value) => {
    dispatch(setSearch(value));
  }, 500);
  return (
    <div className="flex h-32 w-full justify-center bg-[#F7F7F7] md:h-64">
      <div className="flex h-full w-4/5 max-w-xl flex-col justify-center">
        <h2 className="text-lg font-semibold">Wyszukaj:</h2>
        <div className="flex items-center py-2">
          <Input
            className="rounded-e-none"
            onChange={(e) => {
              deboundedSearch(e.target.value);
            }}
            placeholder="Wyszukaj wydarzenie"
          />
          {/* TODO: fix search button */}
          <div className="ml-2 flex aspect-square h-full scale-105 items-center justify-center bg-primary">
            <Search color="white" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

type SearchState = {
  search: string;
};

const initialState: SearchState = {
  search: '',
};

export const SearchSlice = createSlice({
  name: 'search',
  initialState: initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
  },
});

export const { setSearch } = SearchSlice.actions;

export const selectSearch = (state: RootState) => state.search.search;

export default SearchSlice.reducer;

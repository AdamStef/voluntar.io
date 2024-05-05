import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

type PagingState = {
  currentPage: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
};

const initialState: PagingState = {
  currentPage: 0,
  totalPages: 0,
  isFirstPage: true,
  isLastPage: false,
};

export const PagingSlice = createSlice({
  name: 'paging',
  initialState: initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
    setIsFirstPage: (state, action: PayloadAction<boolean>) => {
      state.isFirstPage = action.payload;
    },
    setIsLastPage: (state, action: PayloadAction<boolean>) => {
      state.isLastPage = action.payload;
    },
  },
});

export const { setCurrentPage, setTotalPages, setIsFirstPage, setIsLastPage } =
  PagingSlice.actions;

export const selectCurrentPage = (state: RootState) => state.paging.currentPage;
export const selectTotalPages = (state: RootState) => state.paging.totalPages;
export const selectIsFirstPage = (state: RootState) => state.paging.isFirstPage;
export const selectIsLastPage = (state: RootState) => state.paging.isLastPage;

export default PagingSlice.reducer;

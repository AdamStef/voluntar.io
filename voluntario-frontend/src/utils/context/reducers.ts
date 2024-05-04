import { combineReducers } from '@reduxjs/toolkit';

import pagingReducer from './paging/pagingSlice';
import searchReducer from './searchSlice';

export default combineReducers({
  paging: pagingReducer,
  search: searchReducer,
});

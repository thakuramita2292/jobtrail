import { configureStore } from '@reduxjs/toolkit';
import applicationsReducer from './ApplicationSlice';

export const store = configureStore({
  reducer: {
    applications: applicationsReducer,
  },
});
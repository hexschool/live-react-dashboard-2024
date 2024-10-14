import { createSlice } from '@reduxjs/toolkit';

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    status: false,
  },
  reducers: {
    showLoading() {
      return { status: true };
    },
    hideLoading() {
      return { status: false };
    },
  },
});

export const { showLoading, hideLoading } = loadingSlice.actions;

export default loadingSlice.reducer;

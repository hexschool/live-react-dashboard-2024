import { configureStore } from '@reduxjs/toolkit';

import messageReducer from '@/slice/messageSlice';
import loadingReducer from '@/slice/loadingSlice';

const store = configureStore({
  reducer: {
    message: messageReducer,
    loading: loadingReducer,
  },
});

export default store;

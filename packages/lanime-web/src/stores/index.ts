import { configureStore } from "@reduxjs/toolkit";
import { episodeModalReducer } from '@stores/episodeModal';
import { userProfileReducer } from '@stores/auth';

export const store = configureStore({
  reducer: {
    episodeModal: episodeModalReducer,
    userProfile: userProfileReducer
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

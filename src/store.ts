import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { api } from './service/singledata-api';
import { apiSites } from './service/site-api';
import { useDispatch } from 'react-redux';
// import authReducer from './authSlice';
import { setupListeners } from '@reduxjs/toolkit/query';

const rootReducer = combineReducers({
    [api.reducerPath]: api.reducer,
    [apiSites.reducerPath]: apiSites.reducer,
    //auth: authReducer
  });

//   type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (gDM) => gDM().concat(api.middleware, apiSites.middleware),
})

setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>() 
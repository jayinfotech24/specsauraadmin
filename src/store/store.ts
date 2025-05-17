import { configureStore, Middleware, AnyAction } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

const authMiddleware: Middleware = () => (next) => (action: unknown) => {
  const typedAction = action as AnyAction;
  if (typedAction.error?.message === 'Request failed with status code 401') {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      window.location.href = '/signin';
    }
  }
  return next(action);
};

export const store = configureStore({
    reducer: {
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(authMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store; 
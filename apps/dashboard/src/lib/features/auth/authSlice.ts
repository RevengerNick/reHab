import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  name: string;
  // Add other user properties as needed
}

interface AuthState {
  token: string | null;
  user: { id: string; email: string; name: string; } | null;
}

const initialState: AuthState = {
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  user: null, // Пользователя будем загружать отдельно
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      { payload: { token, user } }: PayloadAction<{ token: string; user: any }>
    ) => {
      state.token = token;
      state.user = user;
      // Сохраняем токен в localStorage
      localStorage.setItem('token', token);
    },
    logOut: (state) => {
      state.token = null;
      state.user = null;
      // Удаляем токен из localStorage
      localStorage.removeItem('token');
    },
  },
});
export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;
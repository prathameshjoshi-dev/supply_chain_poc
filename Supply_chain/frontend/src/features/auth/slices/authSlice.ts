import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { jwtDecode } from 'jwt-decode';

interface AuthState {
  user: any | null;
  token: string | null;
}

let initialUser = null;
const storedToken = localStorage.getItem('token');
if (storedToken) {
  try {
    const payload: any = jwtDecode(storedToken);
    initialUser = { _id: payload.sub, email: payload.email, role: payload.role };
  } catch (e) {
    localStorage.removeItem('token');
  }
}

const initialState: AuthState = {
  user: initialUser,
  token: storedToken && initialUser ? storedToken : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: any; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

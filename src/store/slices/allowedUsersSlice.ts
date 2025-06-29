import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AllowedUsersSettings, AllowedUser } from '@app/types/allowedUsers.types';

interface AllowedUsersState {
  settings: AllowedUsersSettings | null;
  users: AllowedUser[];
  loading: boolean;
  error: string | null;
}

const initialState: AllowedUsersState = {
  settings: null,
  users: [],
  loading: false,
  error: null,
};

const allowedUsersSlice = createSlice({
  name: 'allowedUsers',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSettings: (state, action: PayloadAction<AllowedUsersSettings>) => {
      state.settings = action.payload;
    },
    setUsers: (state, action: PayloadAction<AllowedUser[]>) => {
      state.users = action.payload;
    },
    addUser: (state, action: PayloadAction<AllowedUser>) => {
      state.users.push(action.payload);
    },
    removeUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter(user => user.npub !== action.payload);
    },
    updateUser: (state, action: PayloadAction<{ npub: string; updates: Partial<AllowedUser> }>) => {
      const index = state.users.findIndex(user => user.npub === action.payload.npub);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload.updates };
      }
    },
    clearState: (state) => {
      state.settings = null;
      state.users = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setSettings,
  setUsers,
  addUser,
  removeUser,
  updateUser,
  clearState,
} = allowedUsersSlice.actions;

export default allowedUsersSlice.reducer;

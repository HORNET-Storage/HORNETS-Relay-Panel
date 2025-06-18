import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AllowedUsersSettings, AllowedUsersNpub } from '@app/types/allowedUsers.types';

interface AllowedUsersState {
  settings: AllowedUsersSettings | null;
  readNpubs: AllowedUsersNpub[];
  writeNpubs: AllowedUsersNpub[];
  loading: boolean;
  error: string | null;
}

const initialState: AllowedUsersState = {
  settings: null,
  readNpubs: [],
  writeNpubs: [],
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
    setReadNpubs: (state, action: PayloadAction<AllowedUsersNpub[]>) => {
      state.readNpubs = action.payload;
    },
    setWriteNpubs: (state, action: PayloadAction<AllowedUsersNpub[]>) => {
      state.writeNpubs = action.payload;
    },
    addReadNpub: (state, action: PayloadAction<AllowedUsersNpub>) => {
      state.readNpubs.push(action.payload);
    },
    addWriteNpub: (state, action: PayloadAction<AllowedUsersNpub>) => {
      state.writeNpubs.push(action.payload);
    },
    removeReadNpub: (state, action: PayloadAction<string>) => {
      state.readNpubs = state.readNpubs.filter(npub => npub.npub !== action.payload);
    },
    removeWriteNpub: (state, action: PayloadAction<string>) => {
      state.writeNpubs = state.writeNpubs.filter(npub => npub.npub !== action.payload);
    },
    clearState: (state) => {
      state.settings = null;
      state.readNpubs = [];
      state.writeNpubs = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setSettings,
  setReadNpubs,
  setWriteNpubs,
  addReadNpub,
  addWriteNpub,
  removeReadNpub,
  removeWriteNpub,
  clearState,
} = allowedUsersSlice.actions;

export default allowedUsersSlice.reducer;
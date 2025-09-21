import { ThemeType } from '@app/interfaces/interfaces';
import { createSlice, createAction, PrepareAction } from '@reduxjs/toolkit';

interface ThemeState {
  theme: ThemeType;
}

// Liquid Blue is the only theme
export const defaultTheme: ThemeType = 'liquid-blue';

localStorage.setItem('theme', defaultTheme);

const initialState: ThemeState = {
  theme: defaultTheme,
};

export const setTheme = createAction<PrepareAction<ThemeType>>('theme/setTheme', (theme: ThemeType) => {
  localStorage.setItem('theme', theme);
  return {
    payload: theme,
  };
});

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setTheme, (state, action) => {
      state.theme = action.payload;
    });
  },
});

export default themeSlice.reducer;
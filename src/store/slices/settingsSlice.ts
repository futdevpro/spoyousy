import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  searchPreferences: {
    useExactMatch: boolean;
    includeRemixes: boolean;
    includeLiveVersions: boolean;
  };
  autoResync: boolean;
  manualVideoOverride: string | null;
}

const initialState: SettingsState = {
  searchPreferences: {
    useExactMatch: true,
    includeRemixes: false,
    includeLiveVersions: false,
  },
  autoResync: true,
  manualVideoOverride: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSearchPreferences: (state, action: PayloadAction<SettingsState['searchPreferences']>) => {
      state.searchPreferences = action.payload;
    },
    setAutoResync: (state, action: PayloadAction<boolean>) => {
      state.autoResync = action.payload;
    },
    setManualVideoOverride: (state, action: PayloadAction<string | null>) => {
      state.manualVideoOverride = action.payload;
    },
  },
});

export const { setSearchPreferences, setAutoResync, setManualVideoOverride } = settingsSlice.actions;
export default settingsSlice.reducer; 
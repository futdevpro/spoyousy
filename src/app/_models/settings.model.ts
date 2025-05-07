import { Settings } from './settings.interface';

export const INITIAL_SETTINGS: Settings = {
  searchPreferences: {
    useExactMatch: false,
    includeRemixes: true,
    includeLiveVersions: true
  },
  autoResync: true,
  manualVideoOverride: null
}; 
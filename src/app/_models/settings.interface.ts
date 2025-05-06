export interface Settings {
  searchPreferences: {
    useExactMatch: boolean;
    includeRemixes: boolean;
    includeLiveVersions: boolean;
  };
  autoResync: boolean;
  manualVideoOverride: string | null;
} 
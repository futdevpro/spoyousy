import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setSearchPreferences, setAutoResync, setManualVideoOverride } from '@/store/slices/settingsSlice';
import { toast } from 'react-toastify';

interface SettingsState {
  searchPreferences: {
    useExactMatch: boolean;
    includeRemixes: boolean;
    includeLiveVersions: boolean;
  };
  autoResync: boolean;
  manualVideoOverride: string | null;
}

export default function Settings() {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings) as SettingsState;
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchPreferencesChange = (
    field: keyof typeof settings.searchPreferences,
    value: boolean
  ) => {
    dispatch(
      setSearchPreferences({
        ...settings.searchPreferences,
        [field]: value,
      })
    );
    toast.success('Search preferences updated');
  };

  const handleAutoResyncChange = (value: boolean) => {
    dispatch(setAutoResync(value));
    toast.success('Auto-resync setting updated');
  };

  const handleManualOverrideChange = (videoId: string) => {
    dispatch(setManualVideoOverride(videoId));
    toast.success('Manual video override updated');
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary-color hover:bg-opacity-80 text-white px-4 py-2 rounded-lg"
      >
        Settings
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-surface-color rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>

            {/* Search Preferences */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Search Preferences</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.searchPreferences.useExactMatch}
                    onChange={(e) =>
                      handleSearchPreferencesChange('useExactMatch', e.target.checked)
                    }
                    className="mr-2"
                  />
                  Use exact match
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.searchPreferences.includeRemixes}
                    onChange={(e) =>
                      handleSearchPreferencesChange('includeRemixes', e.target.checked)
                    }
                    className="mr-2"
                  />
                  Include remixes
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.searchPreferences.includeLiveVersions}
                    onChange={(e) =>
                      handleSearchPreferencesChange('includeLiveVersions', e.target.checked)
                    }
                    className="mr-2"
                  />
                  Include live versions
                </label>
              </div>
            </div>

            {/* Auto Resync */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Sync Settings</h3>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.autoResync}
                  onChange={(e) => handleAutoResyncChange(e.target.checked)}
                  className="mr-2"
                />
                Auto-resync when out of sync
              </label>
            </div>

            {/* Manual Video Override */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Manual Override</h3>
              <input
                type="text"
                value={settings.manualVideoOverride || ''}
                onChange={(e) => handleManualOverrideChange(e.target.value)}
                placeholder="YouTube video ID"
                className="w-full px-3 py-2 bg-background-color rounded border border-gray-600"
              />
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="bg-primary-color hover:bg-opacity-80 text-white px-4 py-2 rounded-lg w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 
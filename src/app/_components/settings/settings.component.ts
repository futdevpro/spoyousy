import { Component, inject } from '@angular/core';
import { SettingsService } from '../../_services/settings.service';
import { CommonModule } from '@angular/common';
import { Settings } from '../../_models/settings.interface';

/**
 * Settings component that provides a user interface for managing application settings.
 * Uses Angular Signals for state management and Tailwind CSS for styling.
 * Handles search preferences, sync settings, and manual video overrides.
 */
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html'
})
export class SettingsComponent {
  protected readonly settingsService = inject(SettingsService);
  protected isOpen = false;

  /**
   * Toggles the settings modal visibility.
   * Includes logging for debugging purposes.
   */
  public toggleSettings(): void {
    console.log('⚙️ Toggling settings visibility');
    try {
      this.isOpen = !this.isOpen;
      console.log('✅ Settings visibility toggled successfully');
    } catch (error) {
      console.error('❌ Failed to toggle settings visibility:', error);
      throw error;
    }
  }

  /**
   * Updates a setting value based on user input.
   * Handles both search preferences and auto-resync settings.
   * 
   * @param key - The setting key to update (either a search preference or 'autoResync')
   * @param event - The change event from the checkbox input
   */
  protected updateSetting(key: keyof Settings['searchPreferences'] | 'autoResync', event: Event): void {
    console.log('⚙️ Updating setting:', key);
    try {
      const target = event.target as HTMLInputElement;
      const value = target.checked;

      if (key === 'autoResync') {
        this.settingsService.setAutoResync(value);
      } else {
        this.settingsService.setSearchPreferences({
          ...this.settingsService.settings_().searchPreferences,
          [key]: value
        });
      }
      console.log('✅ Setting updated successfully:', key);
    } catch (error) {
      console.error('❌ Failed to update setting:', key, error);
      throw error;
    }
  }

  /**
   * Handles changes to the manual video override input.
   * Updates the setting with the new video ID.
   * 
   * @param event - The input event from the text input
   */
  protected handleManualOverrideChange(event: Event): void {
    console.log('🎬 Updating manual video override');
    try {
      const target = event.target as HTMLInputElement;
      const value = target.value.trim();
      this.settingsService.setManualVideoOverride(value || null);
      console.log('✅ Manual video override updated successfully');
    } catch (error) {
      console.error('❌ Failed to update manual video override:', error);
      throw error;
    }
  }
} 
import { Injectable, inject, signal, computed } from '@angular/core';
import { Settings } from '../_models/settings.interface';
import { INITIAL_SETTINGS } from '../_models/settings.const';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly settings = signal<Settings>(INITIAL_SETTINGS);

  readonly settings_ = computed(() => this.settings());
  readonly currentSettings = computed(() => this.settings());

  setSearchPreferences(searchPreferences: Settings['searchPreferences']): void {
    this.settings.update(state => ({
      ...state,
      searchPreferences
    }));
  }

  setAutoResync(autoResync: boolean): void {
    this.settings.update(state => ({
      ...state,
      autoResync
    }));
  }

  setManualVideoOverride(manualVideoOverride: string | null): void {
    this.settings.update(state => ({
      ...state,
      manualVideoOverride
    }));
  }
} 
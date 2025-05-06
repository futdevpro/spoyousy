import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../_services/settings.service';
import { Settings } from '../../_models/settings.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class SettingsComponent implements OnInit {
  private readonly settingsService = inject(SettingsService);
  isOpen = false;
  settings: Settings = this.settingsService.currentSettings;

  ngOnInit() {
    this.settingsService.settings$.subscribe(settings => {
      this.settings = settings;
    });
  }

  handleSearchPreferencesChange(field: keyof Settings['searchPreferences'], event: Event) {
    const value = (event.target as HTMLInputElement).checked;
    this.settingsService.setSearchPreferences({
      ...this.settings.searchPreferences,
      [field]: value
    });
  }

  handleAutoResyncChange(event: Event) {
    const value = (event.target as HTMLInputElement).checked;
    this.settingsService.setAutoResync(value);
  }

  handleManualOverrideChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.settingsService.setManualVideoOverride(value);
  }
} 
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { SettingsService } from '../../_services/settings.service';
import { INITIAL_SETTINGS } from '../../_models/settings.const';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let settingsService: SettingsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [SettingsService]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    settingsService = TestBed.inject(SettingsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display settings button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    expect(button?.textContent?.trim()).toBe('Settings');
  });

  it('should update search preferences when checkbox is clicked', () => {
    const spy = jest.spyOn(settingsService, 'setSearchPreferences');
    component.toggleSettings(); // Open settings panel
    fixture.detectChanges();

    const checkbox = fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(checkbox).toBeTruthy();
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));

    expect(spy).toHaveBeenCalledWith({
      ...INITIAL_SETTINGS.searchPreferences,
      useExactMatch: true
    });
  });

  it('should update auto resync when checkbox is clicked', () => {
    const spy = jest.spyOn(settingsService, 'setAutoResync');
    component.toggleSettings(); // Open settings panel
    fixture.detectChanges();

    const checkboxes = fixture.nativeElement.querySelectorAll('input[type="checkbox"]');
    const autoResyncCheckbox = checkboxes[checkboxes.length - 1] as HTMLInputElement;
    expect(autoResyncCheckbox).toBeTruthy();
    autoResyncCheckbox.checked = true;
    autoResyncCheckbox.dispatchEvent(new Event('change'));

    expect(spy).toHaveBeenCalledWith(true);
  });
}); 
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { SettingsService } from '../../_services/settings.service';
import { Settings } from '../../_models/settings.interface';
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

  it('should display initial settings', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Settings');
    expect(compiled.querySelectorAll('input[type="checkbox"]').length).toBe(4);
  });

  it('should update search preferences when checkbox is clicked', () => {
    const spy = jest.spyOn(settingsService, 'setSearchPreferences');
    const checkbox = fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;

    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change'));

    expect(spy).toHaveBeenCalledWith({
      ...INITIAL_SETTINGS.searchPreferences,
      useExactMatch: true
    });
  });

  it('should update auto resync when checkbox is clicked', () => {
    const spy = jest.spyOn(settingsService, 'setAutoResync');
    const checkboxes = fixture.nativeElement.querySelectorAll('input[type="checkbox"]');
    const autoResyncCheckbox = checkboxes[checkboxes.length - 1] as HTMLInputElement;

    autoResyncCheckbox.checked = true;
    autoResyncCheckbox.dispatchEvent(new Event('change'));

    expect(spy).toHaveBeenCalledWith(true);
  });
}); 
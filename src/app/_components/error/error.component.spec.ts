import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ErrorComponent } from './error.component';
import { Location } from '@angular/common';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display error message from state', () => {
    const error = new Error('Test error');
    history.replaceState({ error }, '');
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const errorMessage = fixture.nativeElement.querySelector('p');
    expect(errorMessage.textContent).toContain('Test error');
  });

  it('should display default error message when no error is provided', () => {
    fixture.detectChanges();
    const errorMessage = fixture.nativeElement.querySelector('p');
    expect(errorMessage.textContent).toContain('An unexpected error occurred');
  });

  it('should navigate to home when goHome is called', () => {
    component.goHome();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should reload page when reload is called', () => {
    spyOn(window.location, 'reload');
    component.reload();
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('should render troubleshooting tips', () => {
    fixture.detectChanges();
    const tipsList = fixture.nativeElement.querySelector('ul');
    expect(tipsList).toBeTruthy();
    expect(tipsList.children.length).toBe(3);
  });

  it('should have proper button styling', () => {
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll<HTMLButtonElement>('button');
    expect(buttons.length).toBe(2);

    buttons.forEach((button: HTMLButtonElement) => {
      expect(button.classList).toContain('w-full');
      expect(button.classList).toContain('text-white');
      expect(button.classList).toContain('font-semibold');
      expect(button.classList).toContain('rounded-lg');
    });
  });
}); 
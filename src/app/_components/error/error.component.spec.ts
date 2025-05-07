import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ErrorComponent } from './error.component';

/**
 * Test suite for the ErrorComponent.
 * Tests error handling, navigation, and UI rendering functionality.
 */
describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;
  let router: Router;
  let reloadMock: jest.Mock;

  /**
   * Setup before each test:
   * - Mocks window.location.reload
   * - Configures TestBed with necessary dependencies
   * - Creates component instance
   */
  beforeEach(async () => {
    console.log('🔄 Setting up test environment...');

    // Mock window.location.reload
    reloadMock = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true
    });

    await TestBed.configureTestingModule({
      imports: [ErrorComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jest.fn()
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    console.log('✅ Test environment setup complete');
  });

  /**
   * Cleanup after each test:
   * - Restores window.location to its original state
   */
  afterEach(() => {
    console.log('🧹 Cleaning up test environment...');
    Object.defineProperty(window, 'location', {
      value: { reload: jest.fn() },
      writable: true
    });
    console.log('✅ Test environment cleanup complete');
  });

  it('should create', () => {
    console.log('🧪 Testing component creation...');
    expect(component).toBeTruthy();
    console.log('✅ Component created successfully');
  });

  it('should display error message from state', () => {
    console.log('🧪 Testing error message display from state...');
    const error = new Error('Test error');
    history.replaceState({ error }, '');
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const errorMessage = fixture.nativeElement.querySelector('p');
    expect(errorMessage.textContent).toContain('Test error');
    console.log('✅ Error message displayed correctly');
  });

  it('should display default error message when no error is provided', () => {
    console.log('🧪 Testing default error message display...');
    history.replaceState({}, ''); // Clear any existing state
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const errorMessage = fixture.nativeElement.querySelector('p');
    expect(errorMessage.textContent).toContain('An unexpected error occurred');
    console.log('✅ Default error message displayed correctly');
  });

  it('should navigate to home when goHome is called', () => {
    console.log('🧪 Testing home navigation...');
    component.goHome();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    console.log('✅ Home navigation triggered successfully');
  });

  it('should reload page when reload is called', () => {
    console.log('🧪 Testing page reload...');
    component.reload();
    expect(reloadMock).toHaveBeenCalled();
    console.log('✅ Page reload triggered successfully');
  });

  it('should render troubleshooting tips', () => {
    console.log('🧪 Testing troubleshooting tips rendering...');
    fixture.detectChanges();
    const tipsList = fixture.nativeElement.querySelector('ul');
    expect(tipsList).toBeTruthy();
    expect(tipsList.children.length).toBe(3);
    console.log('✅ Troubleshooting tips rendered correctly');
  });

  it('should have proper button styling', () => {
    console.log('🧪 Testing button styling...');
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    expect(buttons.length).toBe(2);

    buttons.forEach((button: HTMLButtonElement) => {
      expect(button.classList).toContain('w-full');
      expect(button.classList).toContain('text-white');
      expect(button.classList).toContain('font-semibold');
      expect(button.classList).toContain('rounded-lg');
    });
    console.log('✅ Button styling verified');
  });
}); 
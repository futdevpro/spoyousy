import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
  private router = inject(Router);
  error: Error | null = null;

  constructor() {
    // Get error from history state
    const state = history.state;
    if (state?.error) {
      this.error = state.error;
      console.error('🔍 Error details:', this.error);
    }
  }

  reload(): void {
    console.log('🔄 Reloading page...');
    window.location.reload();
  }

  goHome(): void {
    console.log('🏠 Navigating to home...');
    this.router.navigate(['/']);
  }
} 
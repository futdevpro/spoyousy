import { Injectable, ErrorHandler, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {
  private readonly router = inject(Router);

  handleError(error: Error | HttpErrorResponse): void {
    console.error('💥 Global error handler caught an error:', error);

    if (error instanceof HttpErrorResponse) {
      // Handle HTTP errors
      console.error('🌐 HTTP Error:', {
        status: error.status,
        statusText: error.statusText,
        message: error.message,
        url: error.url
      });
    } else {
      // Handle client-side errors
      console.error('🔧 Client Error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }

    // Navigate to error page with error details
    this.router.navigate(['/error'], {
      state: { error }
    });
  }
} 
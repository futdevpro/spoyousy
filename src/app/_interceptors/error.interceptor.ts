import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('🌐 Intercepting request:', req.url);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('💥 HTTP Error Interceptor caught an error:', {
        url: req.url,
        status: error.status,
        message: error.message
      });

      // Dispatch a custom event for HTTP errors
      window.dispatchEvent(new CustomEvent('http-error', {
        detail: {
          request: req,
          error,
          timestamp: new Date().toISOString()
        }
      }));

      return throwError(() => error);
    })
  );
}; 
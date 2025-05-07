import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { GlobalErrorHandlerService } from './_services/error-handler.service';
import { errorInterceptor } from './_interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(
      withInterceptors([errorInterceptor])
    ),
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService
    }
  ]
}; 
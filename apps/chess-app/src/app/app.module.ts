import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { IsMobileModule } from '@app/shared';
import { AuthGuard, AuthInterceptor } from '@ui/auth';
import { ToastrModule } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { GlobalErrorHandler } from './core/errors/global-error-handler.service';
import { HttpErrorInterceptor } from './core/errors/http-error.interceptor';
import { AppInitService } from './core/services/app-init.service';

function initializeApp(appInitService: AppInitService) {
  return (): Observable<unknown> => {
    return appInitService.init();
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [CoreModule, AppRoutingModule, ToastrModule.forRoot(), IsMobileModule, CommonModule],
  providers: [
    AuthGuard,
    AppInitService,
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [AppInitService], multi: true },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

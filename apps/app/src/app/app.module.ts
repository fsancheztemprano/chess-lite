import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptorProvider } from '@app/ui/shared/app';
import { HalFormClientModule } from '@hal-form-client';
import { EffectsNgModule } from '@ngneat/effects-ng';
import { ToastrModule } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { AppInitializationService } from './services/app-initialization.service';
import { GlobalErrorHandler } from './services/global-error-handler.service';
import { SessionEffects } from './store/session.effects';
import { TranslocoRootModule } from './transloco-root.module';

export function initializeApp(appInitService: AppInitializationService) {
  return (): Observable<unknown> => {
    return appInitService.initialize();
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    HalFormClientModule.forRoot('/api'),
    ToastrModule.forRoot(),
    TranslocoRootModule,
    EffectsNgModule.forRoot([SessionEffects]),
  ],
  providers: [
    AuthInterceptorProvider,
    AppInitializationService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppInitializationService],
      multi: true,
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

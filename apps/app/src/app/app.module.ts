import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HalFormClientModule, HalFormService } from '@hal-form-client';
import { RxStompService } from '@stomp/ng2-stompjs';
import { ToastrModule } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth/interceptors/auth.interceptor';
import { GlobalErrorHandler } from './core/errors/global-error-handler.service';
import { HttpErrorInterceptor } from './core/errors/http-error.interceptor';
import { TranslocoRootModule } from './core/modules/transloco/transloco-root.module';
import { AppInitializationService } from './core/services/app-initialization.service';
import { TranslationService } from './core/services/translation.service';

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
  ],
  providers: [
    AppInitializationService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppInitializationService, HalFormService, TranslationService],
      multi: true,
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    RxStompService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

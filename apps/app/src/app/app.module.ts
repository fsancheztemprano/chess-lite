import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptorProvider, TranslationService } from '@app/ui/shared/app';
import { HalFormClientModule, HalFormService } from '@hal-form-client';
import { RxStompService } from '@stomp/ng2-stompjs';
import { ToastrModule } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { HttpErrorInterceptor } from './interceptors/http-error.interceptor';
import { AppInitializationService } from './services/app-initialization.service';
import { GlobalErrorHandler } from './services/global-error-handler.service';
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
  ],
  providers: [
    AuthInterceptorProvider,
    AppInitializationService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppInitializationService, HalFormService, TranslationService],
      multi: true,
    },
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    RxStompService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

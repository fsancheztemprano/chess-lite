import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthInterceptorProvider } from '@app/ui/shared/app';
import { HalFormClientModule } from '@hal-form-client';
import { provideEffects, provideEffectsManager } from '@ngneat/effects-ng';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { HttpErrorInterceptorProvider } from './interceptors/http-error.interceptor';
import { AppInitializationProvider } from './services/app-initialization.service';
import { GlobalErrorHandlerProvider } from './services/global-error-handler.service';
import { SessionEffects } from './store/session.effects';
import { TranslocoRootModule } from './transloco-root.module';

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
    GlobalErrorHandlerProvider,
    HttpErrorInterceptorProvider,
    AuthInterceptorProvider,
    AppInitializationProvider,
    provideEffectsManager(),
    provideEffects(SessionEffects),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

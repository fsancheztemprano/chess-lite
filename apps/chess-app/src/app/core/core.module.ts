import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { IsMobileModule } from '../shared/pipes/is-mobile.pipe';
import { AppInitService } from './services/app-init.service';
import { Observable } from 'rxjs';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HalFormClientModule } from '@chess-lite/hal-form-client';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../shared/shared.module';
import { AuthInterceptor } from '../auth/interceptors/auth.interceptor';
import { ThemeComponent } from './components/theme/theme.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReactiveFormsModule } from '@angular/forms';

export function initializeApp(appInitService: AppInitService) {
  return (): Observable<unknown> => {
    return appInitService.init();
  };
}

const MaterialModules = [
  LayoutModule,
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatToolbarModule,
];

@NgModule({
  declarations: [ToolbarComponent, SidenavComponent, ThemeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HalFormClientModule.forRoot('/api'),
    HttpClientModule,
    IsMobileModule,
    ...MaterialModules,
    ReactiveFormsModule,
    SharedModule,
  ],
  exports: [SharedModule, ToolbarComponent, SidenavComponent],
  providers: [
    AppInitService,
    { provide: APP_INITIALIZER, useFactory: initializeApp, deps: [AppInitService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class CoreModule {}

import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HalFormClientModule } from '@chess-lite/hal-form-client';
import { IsMobileModule } from '../shared/pipes/is-mobile.pipe';
import { SharedModule } from '../shared/shared.module';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ThemeComponent } from './components/theme/theme.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';

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
    RouterModule,
    SharedModule,
  ],
  exports: [SharedModule, ToolbarComponent, SidenavComponent],
  providers: [],
})
export class CoreModule {}

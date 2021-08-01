import { LayoutModule } from '@angular/cdk/layout';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HalFormClientModule } from '@chess-lite/hal-form-client';
import { NgLetModule } from '../shared/directives/ng-let.directive';
import { IsMobileModule } from '../shared/pipes/is-mobile.pipe';
import { HeaderComponent } from './components/main-container/header.component';
import { AdministrationSidenavItemComponent } from './components/sidenav/administration-sidenav-item/administration-sidenav-item.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { UserSettingsSidenavItemComponent } from './components/sidenav/user-settings-sidenav-item/user-settings-sidenav-item.component';
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
  declarations: [
    ToolbarComponent,
    SidenavComponent,
    ThemeComponent,
    AdministrationSidenavItemComponent,
    UserSettingsSidenavItemComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HalFormClientModule.forRoot('/api'),
    IsMobileModule,
    NgLetModule,
    ...MaterialModules,
    RouterModule,
    MatExpansionModule,
    MatCardModule,
    MatTabsModule,
    MatMenuModule,
  ],
  exports: [ToolbarComponent, SidenavComponent, HeaderComponent],
  providers: [],
})
export class CoreModule {}

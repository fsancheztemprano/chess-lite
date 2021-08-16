import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
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
import { TranslateModule } from '@ngx-translate/core';
import { NgLetModule } from '../shared/directives/ng-let.directive';
import { IsMobileModule } from '../shared/pipes/is-mobile.pipe';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';
import { CoreComponent } from './components/core/core.component';
import { HeaderComponent } from './components/header/header.component';
import { AdministrationSidenavItemComponent } from './components/sidenav/administration-sidenav-item/administration-sidenav-item.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { UserSettingsSidenavItemComponent } from './components/sidenav/user-settings-sidenav-item/user-settings-sidenav-item.component';
import { LocalePickerComponent } from './components/toolbar/locale-picker/locale-picker.component';
import { ThemePickerComponent } from './components/toolbar/theme-picker/theme-picker.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { CoreRoutingModule } from './core-routing.module';

const MaterialModules = [
  LayoutModule,
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatToolbarModule,
  MatExpansionModule,
  MatCardModule,
  MatTabsModule,
  MatMenuModule,
];

@NgModule({
  declarations: [
    CoreComponent,
    ToolbarComponent,
    SidenavComponent,
    ThemePickerComponent,
    AdministrationSidenavItemComponent,
    UserSettingsSidenavItemComponent,
    HeaderComponent,
    LocalePickerComponent,
    ContextMenuComponent,
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    TranslateModule.forChild(),
    IsMobileModule,
    NgLetModule,
    ...MaterialModules,
  ],
})
export class CoreModule {}

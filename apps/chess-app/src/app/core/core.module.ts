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
import { ToastrModule } from 'ngx-toastr';
import { AuthGuard } from '../auth/guards/auth.guard';
import { NgLetModule } from '../shared/directives/ng-let.directive';
import { IsMobileModule } from '../shared/pipes/is-mobile.pipe';
import { CoreComponent } from './components/core/core.component';
import { HeaderComponent } from './components/header/header.component';
import { AdministrationSidenavItemComponent } from './components/sidenav/administration-sidenav-item/administration-sidenav-item.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { UserSettingsSidenavItemComponent } from './components/sidenav/user-settings-sidenav-item/user-settings-sidenav-item.component';
import { ThemeComponent } from './components/theme/theme.component';
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
    ThemeComponent,
    AdministrationSidenavItemComponent,
    UserSettingsSidenavItemComponent,
    HeaderComponent,
  ],
  imports: [CommonModule, CoreRoutingModule, IsMobileModule, NgLetModule, ...MaterialModules, ToastrModule.forRoot()],
  exports: [],
  providers: [AuthGuard],
})
export class CoreModule {}

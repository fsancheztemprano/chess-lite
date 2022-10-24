import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { IsMobileModule, NgLetModule } from '@app/ui/shared/core';
import { TranslocoModule } from '@ngneat/transloco';
import { SidenavItemComponent } from './components/sidenav-item/sidenav-item.component';
import { AdministrationSidenavItemComponent } from './components/sidenav-items/administration/administration-sidenav-item.component';
import { AuthenticationSidenavItemComponent } from './components/sidenav-items/authentication/authentication-sidenav-item.component';
import { BuildInfoSidenavItemComponent } from './components/sidenav-items/build-info/home-sidenav-item.component';
import { HomeSidenavItemComponent } from './components/sidenav-items/home/home-sidenav-item.component';
import { UserSettingsSidenavItemComponent } from './components/sidenav-items/user-settings/user-settings-sidenav-item.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';

@NgModule({
  declarations: [
    SidenavComponent,
    SidenavItemComponent,
    AdministrationSidenavItemComponent,
    AuthenticationSidenavItemComponent,
    HomeSidenavItemComponent,
    UserSettingsSidenavItemComponent,
    BuildInfoSidenavItemComponent,
  ],
  imports: [
    CommonModule,
    TranslocoModule,
    MatExpansionModule,
    MatListModule,
    MatIconModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    IsMobileModule,
    NgLetModule,
  ],
  exports: [SidenavComponent],
})
export class SidenavModule {}

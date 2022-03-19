import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { AdministrationSidenavItemModule } from '@app/ui/feature/administration';
import { AuthenticationSidenavItemModule } from '@app/ui/feature/authentication';
import { HomeSidenavItemModule } from '@app/ui/feature/home';
import { UserSettingsSidenavItemModule } from '@app/ui/feature/user';
import { IsMobileModule, NgLetModule } from '@app/ui/shared';
import { TranslocoModule } from '@ngneat/transloco';
import { SidenavComponent } from './components/sidenav/sidenav.component';

@NgModule({
  declarations: [SidenavComponent],
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
    HomeSidenavItemModule,
    AdministrationSidenavItemModule,
    UserSettingsSidenavItemModule,
    AuthenticationSidenavItemModule,
  ],
  exports: [SidenavComponent],
})
export class SidenavModule {}

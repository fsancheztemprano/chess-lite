import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { AuthenticationSidenavItemModule } from '@app/ui/feature/authentication';
import { HomeSidenavItemModule } from '@app/ui/feature/home';
import { IsMobileModule, NgLetModule } from '@app/ui/shared';
import { TranslocoModule } from '@ngneat/transloco';
import { UserSettingsSidenavItemModule } from '../../../../../../../apps/app/src/app/modules/user-settings/modules/sidenav-item/user-settings-sidenav-item.module';
import { AdministrationSidenavItemModule } from '../../../../../feature/administration/src/lib/modules/sidenav-item/administration-sidenav-item.module';
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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { IsMobileModule } from '../../../shared/modules/is-mobile/is-mobile.module';
import { NgLetModule } from '../../../shared/modules/ng-let/ng-let.module';
import { AdministrationSidenavItemComponent } from './components/administration-sidenav-item/administration-sidenav-item.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { UserSettingsSidenavItemComponent } from './components/user-settings-sidenav-item/user-settings-sidenav-item.component';

@NgModule({
  declarations: [SidenavComponent, AdministrationSidenavItemComponent, UserSettingsSidenavItemComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatListModule,
    MatIconModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    TranslateModule,
    IsMobileModule,
    NgLetModule,
  ],
  exports: [SidenavComponent],
})
export class SidenavModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { IsMobileModule, NgLetModule } from '@app/ui/shared';
import { TranslocoModule } from '@ngneat/transloco';
import { AdministrationSidenavItemComponent } from './components/administration-sidenav-item/administration-sidenav-item.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { UserSettingsSidenavItemComponent } from './components/user-settings-sidenav-item/user-settings-sidenav-item.component';

@NgModule({
  declarations: [SidenavComponent, AdministrationSidenavItemComponent, UserSettingsSidenavItemComponent],
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

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SidenavItemModule } from '@app/ui/shared/common';
import { TranslocoModule } from '@ngneat/transloco';
import { AdministrationSidenavItemComponent } from './components/administration-sidenav-item.component';

@NgModule({
  declarations: [AdministrationSidenavItemComponent],
  imports: [CommonModule, SidenavItemModule, TranslocoModule],
  exports: [AdministrationSidenavItemComponent],
})
export class AdministrationSidenavItemModule {}

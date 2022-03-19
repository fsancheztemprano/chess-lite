import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { AdministrationSidenavItemComponent } from './components/administration-sidenav-item.component';

@NgModule({
  declarations: [AdministrationSidenavItemComponent],
  imports: [CommonModule, MatExpansionModule, MatIconModule, MatListModule, RouterModule],
  exports: [AdministrationSidenavItemComponent],
})
export class AdministrationSidenavItemModule {}

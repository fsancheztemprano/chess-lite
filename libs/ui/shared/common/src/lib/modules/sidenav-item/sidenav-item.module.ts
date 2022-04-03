import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { SidenavItemComponent } from './components/sidenav-item.component';

@NgModule({
  declarations: [SidenavItemComponent],
  imports: [CommonModule, MatExpansionModule, MatListModule, MatIconModule, RouterModule],
  exports: [SidenavItemComponent],
})
export class SidenavItemModule {}

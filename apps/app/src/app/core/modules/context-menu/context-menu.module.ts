import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ContextMenuComponent } from './components/context-menu/context-menu.component';

@NgModule({
  declarations: [ContextMenuComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule],
  exports: [ContextMenuComponent],
})
export class ContextMenuModule {}

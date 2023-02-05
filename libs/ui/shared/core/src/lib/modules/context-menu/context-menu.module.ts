import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { RouterModule } from '@angular/router';
import { ContextMenuComponent } from './components/context-menu.component';

@NgModule({
  declarations: [ContextMenuComponent],
  imports: [CommonModule, MatIconModule, MatMenuModule, MatButtonModule, MatTooltipModule, RouterModule],
  exports: [ContextMenuComponent],
})
export class ContextMenuModule {}

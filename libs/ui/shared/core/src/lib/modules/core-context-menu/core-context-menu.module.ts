import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslocoModule } from '@ngneat/transloco';
import { ContextMenuModule } from '../context-menu';
import { CoreContextMenuComponent } from './components/core-context-menu.component';

@NgModule({
  declarations: [CoreContextMenuComponent],
  imports: [CommonModule, ContextMenuModule, TranslocoModule],
  exports: [CoreContextMenuComponent],
})
export class CoreContextMenuModule {}

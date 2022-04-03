import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { IsMobileModule } from '@app/ui/shared/core';
import { ContextMenuModule } from '../context-menu/context-menu.module';
import { CardViewHeaderComponent } from './components/card-view-header/card-view-header.component';
import { CardViewComponent } from './components/card-view/card-view.component';

@NgModule({
  declarations: [CardViewHeaderComponent, CardViewComponent],
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    MatIconModule,
    MatTabsModule,
    IsMobileModule,
    ContextMenuModule,
    MatButtonModule,
  ],
  exports: [CardViewComponent],
})
export class CardViewModule {}

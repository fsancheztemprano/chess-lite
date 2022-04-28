import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { CoreContextMenuModule, IsMobileModule } from '@app/ui/shared/core';
import { CoreCardViewComponent } from './components/core-card-view/core-card-view.component';

@NgModule({
  declarations: [CoreCardViewComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    CoreContextMenuModule,
    IsMobileModule,
  ],
  exports: [CoreCardViewComponent],
})
export class CoreCardViewModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { RouterModule } from '@angular/router';
import { CoreContextMenuModule, IsMobileModule, NgLetModule, RouteUpButtonComponentModule } from '@app/ui/shared/core';
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
    RouteUpButtonComponentModule,
    NgLetModule,
  ],
  exports: [CoreCardViewComponent],
})
export class CoreCardViewModule {}

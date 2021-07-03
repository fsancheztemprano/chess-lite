import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { NgLetModule } from '../shared/directives/ng-let.directive';
import { IsMobileModule } from '../shared/pipes/is-mobile.pipe';

@NgModule({
  declarations: [ToolbarComponent, SidenavComponent],
  exports: [ToolbarComponent, SidenavComponent],
  imports: [
    CommonModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    NgLetModule,
    IsMobileModule,
  ],
})
export class CoreModule {}

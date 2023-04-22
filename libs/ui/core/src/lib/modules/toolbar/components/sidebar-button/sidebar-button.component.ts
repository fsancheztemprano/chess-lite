import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SidebarRepository, sidebarToggleOpen } from '@app/ui/shared/core';
import { Actions } from '@ngneat/effects-ng';

@Component({
  selector: 'app-sidebar-button',
  templateUrl: './sidebar-button.component.html',
  styleUrls: ['./sidebar-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarButtonComponent {
  constructor(public readonly sidebarRepository: SidebarRepository, public readonly actions: Actions) {}

  public toggleSidebar(): void {
    this.actions.dispatch(sidebarToggleOpen());
  }
}

import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { SidenavService, UserService } from '@app/ui/shared';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  @ViewChild('sidenav') sidenav: MatSidenav | undefined;

  constructor(public readonly sidenavService: SidenavService, public readonly userService: UserService) {
    this._subscribeToSidenavOpenEvent();
  }

  private _subscribeToSidenavOpenEvent() {
    this.sidenavService.isOpen$.pipe(untilDestroyed(this)).subscribe((isOpen) => this.sidenav?.toggle(isOpen));
  }

  public toggleSidenav() {
    if (this.sidenav?.mode === 'over') {
      this.sidenavService.toggle();
    }
  }
}

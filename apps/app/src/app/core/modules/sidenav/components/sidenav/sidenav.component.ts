import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SessionService } from '../../../../services/session.service';
import { SidenavService } from '../../../../services/sidenav.service';
import { UserService } from '../../../../services/user.service';

@UntilDestroy()
@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavComponent {
  @ViewChild('sidenav') sidenav: MatSidenav | undefined;

  constructor(
    public readonly sidenavService: SidenavService,
    public readonly userService: UserService,
    public readonly sessionService: SessionService,
    private readonly router: Router,
  ) {
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

  public logout(): void {
    this.sessionService.clearSession().subscribe(() => this.router.navigate(['auth', 'signup']));
  }
}

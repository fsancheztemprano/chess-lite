import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { clearSession } from '@app/ui/shared/app';
import { AuthRelations, CurrentUserRelations, MenuData } from '@app/ui/shared/domain';
import { HalFormService } from '@hal-form-client';
import { Actions } from '@ngneat/effects-ng';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-authentication-sidenav-item',
  templateUrl: './authentication-sidenav-item.component.html',
  styleUrls: ['./authentication-sidenav-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthenticationSidenavItemComponent {
  @Output() toggleSidenav = new EventEmitter();

  constructor(
    private readonly halFormService: HalFormService,
    private readonly actions: Actions,
    private readonly router: Router,
    private readonly translocoService: TranslocoService,
  ) {}

  items: MenuData[] = [
    {
      icon: 'logout',
      title$: this.translocoService.selectTranslate('core.sidenav.authentication.subtitle.logout'),
      callback: this.logout.bind(this),
      visible$: this.halFormService.hasLink(CurrentUserRelations.CURRENT_USER_REL),
    },
    {
      icon: 'login',
      title$: this.translocoService.selectTranslate('core.sidenav.authentication.subtitle.login'),
      route: ['/auth', 'login'],
      visible$: this.halFormService.hasLink(AuthRelations.LOGIN_RELATION),
    },
    {
      icon: 'assignment_ind',
      title$: this.translocoService.selectTranslate('core.sidenav.authentication.subtitle.signup'),
      route: ['/auth', 'signup'],
      visible$: this.halFormService.hasLink(AuthRelations.SIGNUP_RELATION),
    },
  ];

  public logout(): void {
    this.actions.dispatch(clearSession());
    this.router.navigate(['auth', 'login']);
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AdministrationRelations, AuthRelations, CurrentUserRelations, MenuData } from '@app/ui/shared/domain';
import { HalFormService } from '@hal-form-client';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  public readonly tiles: MenuData[] = [
    {
      id: 'user-settings-tile',
      icon: 'person',
      title$: this.translocoService.selectTranslate('home.main.tiles.user-settings.title'),
      subtitle$: this.translocoService.selectTranslate('home.main.tiles.user-settings.description'),
      route: 'user',
      visible$: this.halFormService.hasLink(CurrentUserRelations.CURRENT_USER_REL),
    },
    {
      id: 'administration-tile',
      icon: 'admin_panel_settings',
      title$: this.translocoService.selectTranslate('home.main.tiles.administration.title'),
      subtitle$: this.translocoService.selectTranslate('home.main.tiles.administration.description'),
      route: 'administration',
      visible$: this.halFormService.hasLink(AdministrationRelations.ADMINISTRATION_REL),
    },
    {
      id: 'login-tile',
      icon: 'login',
      title$: this.translocoService.selectTranslate('home.main.tiles.login.title'),
      subtitle$: this.translocoService.selectTranslate('home.main.tiles.login.description'),
      route: 'auth',
      visible$: this.halFormService.hasLink(AuthRelations.LOGIN_RELATION),
    },
    {
      id: 'signup-tile',
      icon: 'assignment_ind',
      title$: this.translocoService.selectTranslate('home.main.tiles.signup.title'),
      subtitle$: this.translocoService.selectTranslate('home.main.tiles.signup.description'),
      route: ['/auth', 'signup'],
      visible$: this.halFormService.hasLink(AuthRelations.SIGNUP_RELATION),
    },
  ];

  constructor(private readonly halFormService: HalFormService, private readonly translocoService: TranslocoService) {}
}

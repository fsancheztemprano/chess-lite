import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { CoreService, TiledMenuTileData } from '@app/ui/shared/core';
import { AdministrationRelations, AuthRelations, CurrentUserRelations } from '@app/ui/shared/domain';
import { HalFormService } from '@hal-form-client';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnDestroy {
  tiles: TiledMenuTileData[] = [
    {
      icon: 'person',
      title$: this.translocoService.selectTranslate('home.main.tiles.user-settings.title'),
      subtitle$: this.translocoService.selectTranslate('home.main.tiles.user-settings.description'),
      link: 'user',
      canShow: this.halFormService.hasLink(CurrentUserRelations.CURRENT_USER_REL),
    },
    {
      icon: 'admin_panel_settings',
      title$: this.translocoService.selectTranslate('home.main.tiles.administration.title'),
      subtitle$: this.translocoService.selectTranslate('home.main.tiles.administration.description'),
      link: 'administration',
      canShow: this.halFormService.hasLink(AdministrationRelations.ADMINISTRATION_REL),
    },
    {
      icon: 'login',
      title$: this.translocoService.selectTranslate('home.main.tiles.login.title'),
      subtitle$: this.translocoService.selectTranslate('home.main.tiles.login.description'),
      link: 'auth',
      canShow: this.halFormService.hasLink(AuthRelations.LOGIN_RELATION),
    },
    {
      icon: 'assignment_ind',
      title$: this.translocoService.selectTranslate('home.main.tiles.signup.title'),
      subtitle$: this.translocoService.selectTranslate('home.main.tiles.signup.description'),
      link: 'auth/signup',
      canShow: this.halFormService.hasLink(AuthRelations.SIGNUP_RELATION),
    },
  ];

  constructor(
    private readonly coreService: CoreService,
    private readonly halFormService: HalFormService,
    private readonly translocoService: TranslocoService,
  ) {
    this.coreService.setCoreStyle('raw');
  }

  ngOnDestroy(): void {
    this.coreService.reset();
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ThemeService } from '@app/ui/shared/app';
import { updateTheme } from '@app/ui/shared/core';
import { IThemeModel, ThemeModel } from '@app/ui/shared/domain';
import { Actions } from '@ngneat/effects-ng';

@Component({
  selector: 'app-administration-theme',
  templateUrl: './administration-theme.component.html',
  styleUrls: ['./administration-theme.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministrationThemeComponent {
  public themeResource?: ThemeModel = this.route.snapshot.data.theme;

  constructor(
    private readonly actions: Actions,
    private readonly themeService: ThemeService,
    private readonly route: ActivatedRoute,
  ) {}

  colorChanges($event: IThemeModel) {
    if (!this.themeResource) return;
    this.themeService
      .updateTheme(this.themeResource, $event)
      .subscribe((theme) => this.actions.dispatch(updateTheme(theme)));
  }
}

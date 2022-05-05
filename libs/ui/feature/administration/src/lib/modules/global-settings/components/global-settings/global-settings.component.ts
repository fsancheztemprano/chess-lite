import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MenuData } from '@app/ui/shared/domain';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-global-settings',
  templateUrl: './global-settings.component.html',
  styleUrls: ['./global-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSettingsComponent {
  public readonly TRANSLOCO_SCOPE = 'administration.global-settings';
  public readonly tabs: MenuData[] = [
    {
      title$: this.translocoService.selectTranslate(`${this.TRANSLOCO_SCOPE}.tabs.general-settings`),
      route: ['/administration', 'global-settings', 'general'],
    },
    {
      title$: this.translocoService.selectTranslate(`${this.TRANSLOCO_SCOPE}.tabs.access-restrictions`),
      route: ['/administration', 'global-settings', 'access-restrictions'],
    },
  ];

  constructor(private readonly translocoService: TranslocoService) {}
}

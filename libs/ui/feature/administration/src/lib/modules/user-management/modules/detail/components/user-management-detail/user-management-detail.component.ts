import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuData } from '@app/ui/shared/domain';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-user-management-detail',
  templateUrl: './user-management-detail.component.html',
  styleUrls: ['./user-management-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementDetailComponent {
  private readonly baseRoute = ['/administration', 'user-management', 'users', this.route.snapshot?.params?.userId];
  public readonly TRANSLOCO_SCOPE = 'administration.user-management.detail';
  public readonly tabs: MenuData[] = [
    {
      title$: this.translocoService.selectTranslate(`${this.TRANSLOCO_SCOPE}.tabs.profile`),
      route: [...this.baseRoute, 'profile'],
    },
    {
      title$: this.translocoService.selectTranslate(`${this.TRANSLOCO_SCOPE}.tabs.preferences`),
      route: [...this.baseRoute, 'preferences'],
    },
    {
      title$: this.translocoService.selectTranslate(`${this.TRANSLOCO_SCOPE}.tabs.authority`),
      route: [...this.baseRoute, 'authority'],
    },
    {
      title$: this.translocoService.selectTranslate(`${this.TRANSLOCO_SCOPE}.tabs.account`),
      route: [...this.baseRoute, 'account'],
    },
  ];

  constructor(private readonly route: ActivatedRoute, private readonly translocoService: TranslocoService) {}
}

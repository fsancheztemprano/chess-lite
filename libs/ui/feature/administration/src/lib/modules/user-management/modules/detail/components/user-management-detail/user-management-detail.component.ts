import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardViewHeaderService } from '@app/ui/shared';

@Component({
  selector: 'app-user-management-detail',
  templateUrl: './user-management-detail.component.html',
  styleUrls: ['./user-management-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementDetailComponent implements OnDestroy {
  constructor(private readonly headerService: CardViewHeaderService, private readonly route: ActivatedRoute) {
    const baseRoute = ['administration', 'user-management', 'edit', route.snapshot?.params?.userId];
    this.headerService.setHeader({
      title: 'Edit User',
      navigationLink: [baseRoute[0], baseRoute[1], 'list'],
      tabs: [
        {
          label: 'Profile',
          target: [...baseRoute, 'profile'],
        },
        {
          label: 'Preferences',
          target: [...baseRoute, 'preferences'],
        },
        {
          label: 'Authority',
          target: [...baseRoute, 'authority'],
        },
        {
          label: 'Account',
          target: [...baseRoute, 'account'],
        },
      ],
    });
  }

  ngOnDestroy(): void {
    this.headerService.resetHeader();
  }
}
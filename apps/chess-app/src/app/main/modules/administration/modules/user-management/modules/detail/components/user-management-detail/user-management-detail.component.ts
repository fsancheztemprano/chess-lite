import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { HeaderService } from '../../../../../../../../../core/services/header.service';

@Component({
  selector: 'chess-lite-user-management-detail',
  templateUrl: './user-management-detail.component.html',
  styleUrls: ['./user-management-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementDetailComponent implements OnDestroy {
  baseRoute = ['administration', 'user-management', 'edit', 'id-asdasda'];

  constructor(private readonly headerService: HeaderService) {
    this.headerService.setHeader({
      title: 'Edit User',
      navigationLink: [this.baseRoute[0], this.baseRoute[1]],
      tabs: [
        {
          label: 'Profile',
          target: [...this.baseRoute, 'profile'],
        },
        {
          label: 'Authority',
          target: [...this.baseRoute, 'authority'],
        },
        {
          label: 'Danger',
          target: [...this.baseRoute, 'delete'],
        },
      ],
    });
  }

  ngOnDestroy(): void {
    this.headerService.resetHeader();
  }
}

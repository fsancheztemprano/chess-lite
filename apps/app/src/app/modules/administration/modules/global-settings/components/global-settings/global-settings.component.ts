import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { CardViewHeaderService } from '../../../../../../core/modules/card-view/services/card-view-header.service';

@Component({
  selector: 'app-global-settings',
  templateUrl: './global-settings.component.html',
  styleUrls: ['./global-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSettingsComponent implements OnDestroy {
  constructor(private readonly cardViewHeaderService: CardViewHeaderService) {
    this.cardViewHeaderService.setHeader({
      title: 'Global Settings',
      navigationLink: ['../'],
      tabs: [
        {
          label: 'General Settings',
          target: ['administration', 'global-settings', 'general'],
        },
        {
          label: 'Access Restrictions',
          target: ['administration', 'global-settings', 'access-restrictions'],
        },
      ],
    });
  }

  ngOnDestroy(): void {
    this.cardViewHeaderService.resetHeader();
  }
}

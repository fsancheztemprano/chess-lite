import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MenuData } from '@app/ui/shared/domain';

@Component({
  selector: 'app-core-card-view',
  templateUrl: './core-card-view.component.html',
  styleUrls: ['./core-card-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreCardViewComponent {
  @Input() title = '';
  @Input() titleRatio = 1;
  @Input() tabs: MenuData[] = [];
  @Input() tabsRatio = 1;
  @Input() paddedContent = true;
}

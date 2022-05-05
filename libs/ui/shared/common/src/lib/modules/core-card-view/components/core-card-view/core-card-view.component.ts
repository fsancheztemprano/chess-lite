import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BreadcrumbService } from '@app/ui/shared/core';
import { MenuData } from '@app/ui/shared/domain';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-core-card-view',
  templateUrl: './core-card-view.component.html',
  styleUrls: ['./core-card-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreCardViewComponent {
  @Input() icon = 'keyboard_return';
  @Input() iconScaleY = -1;
  @Input() showNavigationLink = true;
  @Input() navigationLink: string | null = null;
  @Input() title = '';
  @Input() titleRatio = 1;
  @Input() tabs: MenuData[] = [];
  @Input() tabsRatio = 1;
  @Input() showContextMenu = false;

  constructor(private readonly breadcrumbService: BreadcrumbService) {}

  get navigationLink$(): Observable<string> {
    return this.navigationLink ? of(this.navigationLink) : this.breadcrumbService.getNavigationUp$();
  }
}

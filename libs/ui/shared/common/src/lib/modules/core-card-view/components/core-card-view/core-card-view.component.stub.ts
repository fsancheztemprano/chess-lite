import { Component, Input } from '@angular/core';
import { MenuData } from '@app/ui/shared/domain';
import { CoreCardViewComponent } from './core-card-view.component';

@Component({ selector: 'app-core-card-view', template: '<ng-content></ng-content>' })
export class StubCoreCardViewComponent implements Partial<CoreCardViewComponent> {
  @Input() title = '';
  @Input() titleRatio = 1;
  @Input() tabs: MenuData[] = [];
  @Input() tabsRatio = 1;
  @Input() showContextMenu = false;
  @Input() paddedContent = true;
}

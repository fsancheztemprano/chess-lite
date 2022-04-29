import { Component, Input } from '@angular/core';
import { MenuData } from '@app/ui/shared/domain';
import { Observable, of } from 'rxjs';
import { CoreCardViewComponent } from './core-card-view.component';

@Component({ selector: 'app-core-card-view', template: '<ng-content></ng-content>' })
export class StubCoreCardViewComponent implements Partial<CoreCardViewComponent> {
  @Input() icon = 'keyboard_return';
  @Input() iconScaleY = -1;
  @Input() showNavigationLink = true;
  @Input() navigationLink: string | null = null;
  @Input() title = '';
  @Input() titleRatio = 1;
  @Input() tabs: MenuData[] = [];
  @Input() tabsRatio = 1;
  @Input() showContextMenu = false;

  get navigationLink$(): Observable<string> {
    return of(this.navigationLink || '');
  }
}

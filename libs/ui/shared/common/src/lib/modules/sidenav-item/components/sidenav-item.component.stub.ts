import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuData } from '@app/ui/shared/domain';
import { SidenavItemComponent } from './sidenav-item.component';

@Component({ selector: 'app-sidenav-item', template: '' })
export class StubSidenavItemComponent implements Partial<SidenavItemComponent> {
  @Output() toggleSidenav = new EventEmitter();
  @Input() items: MenuData[] = [];
  @Input() expandable = false;
  @Input() expandableTitle = '';
  @Input() expandableIcon = '';
  @Input() expandableLink: string[] = [];
}

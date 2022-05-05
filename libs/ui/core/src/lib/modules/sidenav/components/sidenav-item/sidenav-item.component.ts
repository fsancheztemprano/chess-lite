import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MenuData } from '@app/ui/shared/domain';

@Component({
  selector: 'app-sidenav-item',
  templateUrl: './sidenav-item.component.html',
  styleUrls: ['./sidenav-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavItemComponent {
  @Output() toggleSidenav = new EventEmitter();
  @Input() items: MenuData[] = [];
  @Input() expandable = false;
  @Input() expandableTitle = '';
  @Input() expandableIcon = '';
  @Input() expandableLink: string[] = [];

  constructor(public readonly router: Router) {}

  optionClick(option: MenuData, $event: MouseEvent): void {
    if (option.callback && !option.route?.length) {
      $event.stopPropagation();
      $event.preventDefault();
      option.parameters !== undefined ? option.callback(option.parameters) : option.callback();
    }
  }
}

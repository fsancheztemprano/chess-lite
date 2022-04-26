import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MenuData } from '@app/ui/shared/domain';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContextMenuComponent {
  @Input() icon = 'more_vert';
  @Input() xPosition: 'before' | 'after' = 'after';
  @Input() yPosition: 'above' | 'below' = 'below';
  @Input() class = '';
  @Input() title = '';
  @Input() overlapTrigger = false;
  @Input() disabled = false;
  @Input() menuOptions: MenuData[] = [];

  constructor(private readonly router: Router) {}

  optionClick(option: MenuData): void {
    if (option.callback) {
      option.parameters !== undefined ? option.callback(option.parameters) : option.callback();
    } else if (option.route?.length) {
      this.router.navigate([option.route]);
    }
  }

  preventNavigation(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
  }
}

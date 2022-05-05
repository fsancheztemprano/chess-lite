import { Component, Input } from '@angular/core';
import { MenuData } from '@app/ui/shared/domain';
import { ContextMenuComponent } from './context-menu.component';

@Component({ selector: 'app-context-menu', template: '' })
export class StubContextMenuComponent implements Partial<ContextMenuComponent> {
  @Input() icon = 'more_vert';
  @Input() xPosition: 'before' | 'after' = 'after';
  @Input() yPosition: 'above' | 'below' = 'below';
  @Input() class = '';
  @Input() title = '';
  @Input() overlapTrigger = false;
  @Input() disabled = false;
  @Input() menuOptions: MenuData[] = [];
}

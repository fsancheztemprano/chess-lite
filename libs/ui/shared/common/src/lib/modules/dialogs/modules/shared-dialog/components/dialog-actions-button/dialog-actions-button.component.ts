import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-dialog-actions-button',
  templateUrl: './dialog-actions-button.component.html',
  styleUrls: ['./dialog-actions-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogActionsButtonComponent {
  @Input() color: ThemePalette;
  @Input() icon?: string;
  @Input() text!: string;
  @Input() disabled?: boolean;
  @Input() output?: unknown;
}

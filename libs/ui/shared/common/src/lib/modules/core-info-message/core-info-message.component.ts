import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-core-info-message',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './core-info-message.component.html',
  styleUrls: ['./core-info-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreInfoMessageComponent {
  @Input() icon = '';
  @Input() headline = '';
  @Input() subtitle = '';

  @Input() leftButton = false;
  @Input() leftButtonLabel = '';
  @Input() leftButtonIcon = '';
  @Input() leftButtonDisabled = false;
  @Output() leftButtonClick = new EventEmitter<void>();

  @Input() rightButton = false;
  @Input() rightButtonLabel = '';
  @Input() rightButtonIcon = '';
  @Input() rightButtonDisabled = false;
  @Output() rightButtonClick = new EventEmitter<void>();
}

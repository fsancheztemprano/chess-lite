import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { ThemePalette } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { DialogsModule } from '../../dialogs.module';

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

@NgModule({
  declarations: [DialogActionsButtonComponent],
  imports: [DialogsModule, MatButtonModule, MatIconModule],
  exports: [DialogActionsButtonComponent],
})
export class DialogActionsButtonModule {}

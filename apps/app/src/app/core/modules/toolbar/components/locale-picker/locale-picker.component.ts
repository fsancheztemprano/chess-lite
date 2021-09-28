import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TranslationService } from '../../../../services/translation.service';

@Component({
  selector: 'app-locale-picker',
  templateUrl: './locale-picker.component.html',
  styleUrls: ['./locale-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LocalePickerComponent {
  constructor(public readonly translationService: TranslationService) {}
}

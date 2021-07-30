import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'chess-lite-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainContainerComponent {
  constructor(public readonly headerService: HeaderService) {}
}

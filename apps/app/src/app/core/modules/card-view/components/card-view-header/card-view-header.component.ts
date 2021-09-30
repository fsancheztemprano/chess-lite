import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardViewHeaderService } from '../../services/card-view-header.service';

@Component({
  selector: 'app-card-view-header',
  templateUrl: './card-view-header.component.html',
  styleUrls: ['./card-view-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardViewHeaderComponent {
  constructor(public readonly headerService: CardViewHeaderService) {}
}

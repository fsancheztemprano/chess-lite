import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CardViewHeaderService } from '@app/ui/shared/core';

@Component({
  selector: 'app-card-view-header',
  templateUrl: './card-view-header.component.html',
  styleUrls: ['./card-view-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardViewHeaderComponent {
  constructor(public readonly headerService: CardViewHeaderService) {}
}

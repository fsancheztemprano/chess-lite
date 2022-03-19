import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardViewComponent {}

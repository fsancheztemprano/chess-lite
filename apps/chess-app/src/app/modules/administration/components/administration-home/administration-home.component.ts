import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'chess-lite-administration-home',
  templateUrl: './administration-home.component.html',
  styleUrls: ['./administration-home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdministrationHomeComponent {}

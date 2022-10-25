import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-build-info',
  templateUrl: './build-info.component.html',
  styleUrls: ['./build-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildInfoComponent {
  constructor(public readonly route: ActivatedRoute) {}
}

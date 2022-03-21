import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BreadcrumbService } from '@app/ui/shared';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
  constructor(public readonly breadcrumbService: BreadcrumbService) {}
}

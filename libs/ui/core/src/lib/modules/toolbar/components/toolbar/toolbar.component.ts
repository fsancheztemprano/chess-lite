import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BreadcrumbService, SidenavService, ToolbarService } from '@app/ui/shared';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  constructor(
    public readonly toolbarService: ToolbarService,
    public readonly sidenavService: SidenavService,
    public readonly breadcrumbService: BreadcrumbService,
  ) {}
}

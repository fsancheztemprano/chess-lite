import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SidenavService } from '../../services/sidenav.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  constructor(private readonly sidenavService: SidenavService) {}

  sidenavToggle() {
    this.sidenavService.toggle();
  }
}

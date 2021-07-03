import { Component } from '@angular/core';
import { SidenavService } from '../../services/sidenav.service';

@Component({
  selector: 'chess-lite-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  constructor(private readonly sidenavService: SidenavService) {}

  sidenavToggle() {
    this.sidenavService.toggle();
  }
}

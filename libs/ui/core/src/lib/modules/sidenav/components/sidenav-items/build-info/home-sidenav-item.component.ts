import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MenuData } from '@app/ui/shared/domain';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-build-info-sidenav-item',
  templateUrl: './home-sidenav-item.component.html',
  styleUrls: ['./home-sidenav-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BuildInfoSidenavItemComponent {
  @Output() toggleSidenav = new EventEmitter();
  public items: MenuData[] = [
    {
      id: 'build-info',
      title$: this.translocoService.selectTranslate('core.sidenav.home.build-info.title'),
      icon: 'info_outlined',
      route: '/home/build-info',
    },
  ];

  constructor(private readonly translocoService: TranslocoService) {}
}

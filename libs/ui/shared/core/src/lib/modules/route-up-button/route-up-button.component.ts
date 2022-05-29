import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { BreadcrumbService } from '../../services/toolbar/breadcrumb.service';

@Component({
  selector: 'app-route-up-button',
  templateUrl: './route-up-button.component.html',
  styleUrls: ['./route-up-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteUpButtonComponent {
  @Input() icon = 'keyboard_return';
  @Input() iconScaleY = -1;
  @Input() navigationLink: string | null = null;

  constructor(private readonly breadcrumbService: BreadcrumbService) {}

  get navigationLink$(): Observable<string> {
    return this.navigationLink ? of(this.navigationLink) : this.breadcrumbService.parentRoute$;
  }
}

@NgModule({
  imports: [CommonModule, MatButtonModule, RouterModule, MatIconModule],
  declarations: [RouteUpButtonComponent],
  exports: [RouteUpButtonComponent],
})
export class RouteUpButtonComponentModule {}

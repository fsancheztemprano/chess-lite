import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { BreadcrumbService } from './breadcrumb.service';

@Injectable({ providedIn: 'root' })
export class StubBreadcrumbService implements Partial<BreadcrumbService> {
  getBreadcrumbs$ = () => of([]);
  getShowBreadCrumbs$ = () => of(true);
}

export const stubBreadcrumbServiceProvider = {
  provide: BreadcrumbService,
  useClass: StubBreadcrumbService,
};

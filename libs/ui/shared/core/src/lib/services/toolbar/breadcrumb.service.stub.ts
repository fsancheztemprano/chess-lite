import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { Breadcrumb, BreadcrumbService } from './breadcrumb.service';

@Injectable({ providedIn: 'root' })
export class StubBreadcrumbService implements Partial<BreadcrumbService> {
  breadcrumbs = new BehaviorSubject<Breadcrumb[]>([]);
  getBreadcrumbs$ = () => this.breadcrumbs.asObservable();
  getShowBreadCrumbs$ = () => of(true);
}

export const stubBreadcrumbServiceProvider = {
  provide: BreadcrumbService,
  useClass: StubBreadcrumbService,
};

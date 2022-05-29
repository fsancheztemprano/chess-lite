import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Breadcrumb, BreadcrumbService } from './breadcrumb.service';

@Injectable({ providedIn: 'root' })
export class StubBreadcrumbService implements Partial<BreadcrumbService> {
  private readonly _showBreadcrumbs$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _breadcrumbs$: BehaviorSubject<Breadcrumb[]> = new BehaviorSubject<Breadcrumb[]>([]);

  get breadcrumbs$(): Observable<Breadcrumb[]> {
    return this._breadcrumbs$.asObservable();
  }

  set breadcrumbs(breadcrumbs: Breadcrumb[]) {
    this._breadcrumbs$.next(breadcrumbs);
  }

  get showBreadCrumbs$(): Observable<boolean> {
    return this._showBreadcrumbs$.asObservable();
  }

  set showBreadCrumbs(showBreadCrumbs: boolean) {
    this._showBreadcrumbs$.next(showBreadCrumbs);
  }

  get parentRoute$(): Observable<string> {
    return of('parent-route');
  }
}

export const stubBreadcrumbServiceProvider = {
  provide: BreadcrumbService,
  useClass: StubBreadcrumbService,
};

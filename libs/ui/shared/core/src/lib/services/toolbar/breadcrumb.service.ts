import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private readonly _showBreadcrumbs$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private readonly _breadcrumbs$: BehaviorSubject<Breadcrumb[]> = new BehaviorSubject<Breadcrumb[]>([]);

  constructor(private readonly router: Router) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.buildBreadcrumbs(this.router.routerState.snapshot.root, [], [])),
      )
      .subscribe((breadcrumbs: Breadcrumb[]) => this._breadcrumbs$.next(breadcrumbs));
  }

  private buildBreadcrumbs(
    route: ActivatedRouteSnapshot | null,
    parentUrl: string[],
    breadcrumbs: Breadcrumb[],
  ): Breadcrumb[] {
    if (route) {
      const routeUrl = parentUrl.concat(route.url.map((url) => url.path));
      const breadcrumbUrl = '/' + routeUrl.join('/');

      if (route.data?.breadcrumb) {
        if (breadcrumbs[breadcrumbs.length - 1]?.url === breadcrumbUrl) {
          breadcrumbs[breadcrumbs.length - 1].label = this._getBreadcrumbLabel(route);
        } else {
          breadcrumbs.push({
            label: this._getBreadcrumbLabel(route),
            url: breadcrumbUrl,
            parentOffset: route.data?.parentOffset,
          });
        }
      }
      this.buildBreadcrumbs(route.firstChild, routeUrl, breadcrumbs);
    }
    return breadcrumbs;
  }

  private _getBreadcrumbLabel(route: ActivatedRouteSnapshot) {
    return typeof route.data.breadcrumb === 'function' ? route.data.breadcrumb(route.data) : route.data.breadcrumb;
  }

  getBreadcrumbs$(): Observable<Breadcrumb[]> {
    return this._breadcrumbs$.asObservable();
  }

  getNavigationUp$(): Observable<string> {
    return this.getBreadcrumbs$().pipe(
      map((breadcrumbs) => {
        const current = breadcrumbs[breadcrumbs.length - 1];
        return breadcrumbs[breadcrumbs.length - 2 - (current?.parentOffset || 0)]?.url || '';
      }),
    );
  }

  getShowBreadCrumbs$(): Observable<boolean> {
    return this._showBreadcrumbs$.asObservable();
  }

  setShowBreadCrumbs(showBreadCrumbs: boolean) {
    this._showBreadcrumbs$.next(showBreadCrumbs);
  }

  showBreadCrumbs() {
    this.setShowBreadCrumbs(true);
  }

  hideBreadCrumb() {
    this.setShowBreadCrumbs(false);
  }

  reset() {
    this.hideBreadCrumb();
  }
}

export interface Breadcrumb {
  label: string;
  url: string;
  parentOffset?: number;
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Data, NavigationEnd, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { BehaviorSubject, filter, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private readonly _showBreadcrumbs$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _breadcrumbs$: BehaviorSubject<Breadcrumb[]> = new BehaviorSubject<Breadcrumb[]>([]);

  constructor(private readonly router: Router, private readonly translocoService: TranslocoService) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.buildBreadcrumbs(this.router.routerState.snapshot.root, [], [])),
      )
      .subscribe((breadcrumbs: Breadcrumb[]) => this._breadcrumbs$.next(breadcrumbs));
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

  private buildBreadcrumbs(
    route: ActivatedRouteSnapshot | null,
    parentUrl: string[],
    breadcrumbs: Breadcrumb[],
  ): Breadcrumb[] {
    if (route) {
      const routeUrl = parentUrl.concat(route.url.map((url) => url.path));
      const breadcrumbUrl = '/' + routeUrl.join('/');
      if (route.data?.breadcrumb) {
        const breadcrumb = {
          title$: this._getBreadcrumbLabel(route.data),
          url: breadcrumbUrl,
          parentOffset: route.data?.breadcrumb.parentOffset,
          icon: route.data?.breadcrumb?.icon,
        };
        if (breadcrumbs[breadcrumbs.length - 1]?.url === breadcrumbUrl) {
          breadcrumbs[breadcrumbs.length - 1] = breadcrumb;
        } else {
          breadcrumbs.push(breadcrumb);
        }
      }
      this.buildBreadcrumbs(route.firstChild, routeUrl, breadcrumbs);
    }
    return breadcrumbs;
  }

  private _getBreadcrumbLabel(data: Data): Observable<string> | null {
    if (data.breadcrumb.i18n) {
      return this.translocoService.selectTranslate(
        'core.breadcrumb.' +
          (typeof data.breadcrumb.i18n === 'function' ? data.breadcrumb.i18n(data) : data.breadcrumb.i18n),
      );
    }
    if (data.breadcrumb.title) {
      return of(typeof data.breadcrumb.title === 'function' ? data.breadcrumb.title(data) : data.breadcrumb.title);
    }
    return null;
  }
}

export interface Breadcrumb {
  title$: Observable<string> | null;
  url: string;
  icon?: string;
  parentOffset?: number;
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Data, NavigationEnd, Router } from '@angular/router';
import { TranslocoService } from '@ngneat/transloco';
import { BehaviorSubject, filter, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private readonly _showBreadcrumbs$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private readonly _breadcrumbs$: BehaviorSubject<Breadcrumb[]> = new BehaviorSubject<Breadcrumb[]>([]);

  constructor(private readonly router: Router, private readonly translocoService: TranslocoService) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this._buildBreadcrumbs(this.router.routerState.snapshot.root, [], [])),
      )
      .subscribe((breadcrumbs: Breadcrumb[]) => (this.breadcrumbs = breadcrumbs));
  }

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
    return this.breadcrumbs$.pipe(
      map((breadcrumbs) => {
        const current = breadcrumbs[breadcrumbs.length - 1];
        return breadcrumbs[breadcrumbs.length - 2 - (current.parentOffset || 0)]?.url || '';
      }),
    );
  }

  private _buildBreadcrumbs(
    route: ActivatedRouteSnapshot | null,
    parentUrl: string[],
    breadcrumbs: Breadcrumb[],
  ): Breadcrumb[] {
    if (route) {
      const routeUrl = parentUrl.concat(route.url.map((url) => url.path));
      if (route.data.breadcrumb) {
        const breadcrumb: Breadcrumb = {
          title$: this._getBreadcrumbLabel(route.data as BreadcrumbRouteData),
          url: routeUrl.join('/') || '/',
          icon: route.data.breadcrumb.icon,
          parentOffset: route.data.breadcrumb.parentOffset,
        };
        if (breadcrumbs[breadcrumbs.length - 1]?.url === breadcrumb.url) {
          breadcrumbs[breadcrumbs.length - 1] = breadcrumb;
        } else {
          breadcrumbs.push(breadcrumb);
        }
      }
      this._buildBreadcrumbs(route.firstChild, routeUrl, breadcrumbs);
    }
    return breadcrumbs;
  }

  private _getBreadcrumbLabel(data: BreadcrumbRouteData): Observable<string> | null {
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
  url: string;
  title$?: Observable<string> | null;
  icon?: string;
  parentOffset?: number;
}

export interface BreadcrumbRouteData extends Data {
  breadcrumb: {
    icon?: string;
    title?: string | ((data: Data) => string);
    i18n?: string | ((data: Data) => string);
    parentOffset?: number;
  };
}

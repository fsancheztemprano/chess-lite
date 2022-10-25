import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  Data,
  Event,
  NavigationEnd,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { getTranslocoModule } from '@app/ui/testing';
import { firstValueFrom, of, Subject } from 'rxjs';
import { Breadcrumb, BreadcrumbService } from './breadcrumb.service';

describe('BreadcrumbService', () => {
  let service: BreadcrumbService;
  let stubRouter: { events: Subject<Event>; routerState?: RouterStateSnapshot };

  beforeEach(() => {
    stubRouter = { events: new Subject<Event>() };
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, getTranslocoModule()],
      providers: [{ provide: Router, useValue: stubRouter }],
    });
    service = TestBed.inject(BreadcrumbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get breadcrumbs', () => {
    const breadcrumbs = [{ title$: of('title') }];

    expect(service['_breadcrumbs$'].value).toEqual([]);

    service['_breadcrumbs$'].next(breadcrumbs as never);

    expect(service['_breadcrumbs$'].value).toEqual(breadcrumbs);
  });

  it('should set breadcrumbs', () => {
    const breadcrumbs: Breadcrumb[] = [{ title$: of('title'), url: '' }];

    expect(service['_breadcrumbs$'].value).toEqual([]);

    service.breadcrumbs = breadcrumbs;

    expect(service['_breadcrumbs$'].value).toEqual(breadcrumbs);
  });

  describe('parentRoute$', () => {
    it('should get parent route', async () => {
      const breadcrumb = [
        { title$: of('title'), url: '/url1' },
        { title$: of('title'), url: '/url2' },
        { title$: of('title'), url: '/url3' },
      ];
      service['_breadcrumbs$'].next(breadcrumb);

      return expect(firstValueFrom(service.parentRoute$)).resolves.toEqual('/url2');
    });

    it('should get parent route with offset', async () => {
      const breadcrumb = [
        { title$: of('title'), url: '/url1' },
        { title$: of('title'), url: '/url2' },
        { title$: of('title'), url: '/url3', parentOffset: 1 },
      ];
      service['_breadcrumbs$'].next(breadcrumb);

      return expect(firstValueFrom(service.parentRoute$)).resolves.toEqual('/url1');
    });
  });

  describe('_showBreadcrumbs$', () => {
    it('should set showBreadcrumbs', () => {
      expect(service['_showBreadcrumbs$'].value).toBeTrue();

      service.showBreadCrumbs = false;

      expect(service['_showBreadcrumbs$'].value).toBeFalse();
    });

    it('should get showBreadcrumbs', async () => {
      service['_showBreadcrumbs$'].next(false);

      return expect(firstValueFrom(service.showBreadCrumbs$)).resolves.toBeFalse();
    });
  });

  describe('_buildBreadcrumbs', () => {
    it('should not build breadcrumbs if route is nullish', () => {
      let breadcrumbs = service['_buildBreadcrumbs'](null, [], []);

      expect(breadcrumbs).toEqual([]);

      breadcrumbs = service['_buildBreadcrumbs']({ data: {}, url: [new UrlSegment('', {})] } as never, [], []);

      expect(breadcrumbs).toEqual([]);
    });

    it('should build one breadcrumb', async () => {
      const recursiveSpy = jest.spyOn<any, any>(service, '_buildBreadcrumbs');

      const activatedRouteSnapshot: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
      activatedRouteSnapshot.url = [new UrlSegment('', {})];
      activatedRouteSnapshot.data = { breadcrumb: { title: 'title' } };
      (activatedRouteSnapshot as any)['_routerState'] = { firstChild: () => null };

      const breadcrumbs = service['_buildBreadcrumbs'](activatedRouteSnapshot, [], []);

      expect(breadcrumbs).toHaveLength(1);
      expect(breadcrumbs).toPartiallyContain({ url: '/' });
      await expect(firstValueFrom(breadcrumbs[0].title$!)).resolves.toEqual('title');

      expect(recursiveSpy).toHaveBeenCalledTimes(2);
    });

    it('should build two breadcrumbs', async () => {
      const recursiveSpy = jest.spyOn<any, any>(service, '_buildBreadcrumbs');

      const childRoute: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
      childRoute.url = [new UrlSegment('users', {})];
      childRoute.data = { breadcrumb: { title: 'users' } };
      (childRoute as any)['_routerState'] = { firstChild: () => null };

      const parentRoute: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
      parentRoute.url = [new UrlSegment('', {})];
      parentRoute.data = { breadcrumb: { title: 'home' } };
      (parentRoute as any)['_routerState'] = { firstChild: () => childRoute };

      const breadcrumbs = service['_buildBreadcrumbs'](parentRoute, [], []);

      expect(breadcrumbs).toHaveLength(2);
      expect(breadcrumbs[0].url).toEqual('/');
      await expect(firstValueFrom(breadcrumbs[0].title$!)).resolves.toEqual('home');
      expect(breadcrumbs[1].url).toEqual('/users');
      await expect(firstValueFrom(breadcrumbs[1].title$!)).resolves.toEqual('users');

      expect(recursiveSpy).toHaveBeenCalledTimes(3);
    });

    it('should build three breadcrumbs', async () => {
      const recursiveSpy = jest.spyOn<any, any>(service, '_buildBreadcrumbs');

      const grandChildRoute: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
      grandChildRoute.url = [new UrlSegment('userId', {})];
      grandChildRoute.data = { breadcrumb: { title: 'user 1' } };
      (grandChildRoute as any)['_routerState'] = { firstChild: () => null };

      const childRoute: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
      childRoute.url = [new UrlSegment('users', {})];
      childRoute.data = { breadcrumb: { title: 'users' } };
      (childRoute as any)['_routerState'] = { firstChild: () => grandChildRoute };

      const parentRoute: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
      parentRoute.url = [new UrlSegment('', {})];
      parentRoute.data = { breadcrumb: { title: 'home' } };
      (parentRoute as any)['_routerState'] = { firstChild: () => childRoute };

      const breadcrumbs = service['_buildBreadcrumbs'](parentRoute, [], []);

      expect(breadcrumbs).toHaveLength(3);
      expect(breadcrumbs[0].url).toEqual('/');
      await expect(firstValueFrom(breadcrumbs[0].title$!)).resolves.toEqual('home');
      expect(breadcrumbs[1].url).toEqual('/users');
      await expect(firstValueFrom(breadcrumbs[1].title$!)).resolves.toEqual('users');
      expect(breadcrumbs[2].url).toEqual('/users/userId');
      await expect(firstValueFrom(breadcrumbs[2].title$!)).resolves.toEqual('user 1');

      expect(recursiveSpy).toHaveBeenCalledTimes(4);
    });

    it('should override a breadcrumb if route has breadcrumb already', async () => {
      const recursiveSpy = jest.spyOn<any, any>(service, '_buildBreadcrumbs');

      const grandChildRoute: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
      grandChildRoute.url = [new UrlSegment('users', {})];
      grandChildRoute.data = { breadcrumb: { title: 'users b' } };
      (grandChildRoute as any)['_routerState'] = { firstChild: () => null };

      const breadcrumbs = service['_buildBreadcrumbs'](
        grandChildRoute,
        [],
        [
          { url: '/', title$: of('home') },
          { url: 'users', title$: of('users a') },
        ],
      );

      expect(breadcrumbs).toHaveLength(2);
      expect(breadcrumbs[0].url).toEqual('/');
      await expect(firstValueFrom(breadcrumbs[0].title$!)).resolves.toEqual('home');
      expect(breadcrumbs[1].url).toEqual('users');
      await expect(firstValueFrom(breadcrumbs[1].title$!)).resolves.toEqual('users b');

      expect(recursiveSpy).toHaveBeenCalledTimes(2);
    });

    it('should set dynamic breadcrumb title', async () => {
      const activatedRouteSnapshot: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
      activatedRouteSnapshot.url = [new UrlSegment('', {})];
      activatedRouteSnapshot.data = {
        breadcrumb: { title: (data: Data) => data.userId },
        userId: 'userId',
      };
      (activatedRouteSnapshot as any)['_routerState'] = { firstChild: () => null };

      const breadcrumbs = service['_buildBreadcrumbs'](activatedRouteSnapshot, [], []);

      expect(breadcrumbs).toHaveLength(1);
      expect(breadcrumbs).toPartiallyContain({ url: '/' });
      await expect(firstValueFrom(breadcrumbs[0].title$!)).resolves.toEqual('userId');
    });

    it('should set static i18n breadcrumb title ', async () => {
      const activatedRouteSnapshot: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
      activatedRouteSnapshot.url = [new UrlSegment('', {})];
      activatedRouteSnapshot.data = {
        breadcrumb: { i18n: 'home' },
      };
      (activatedRouteSnapshot as any)['_routerState'] = { firstChild: () => null };

      const breadcrumbs = service['_buildBreadcrumbs'](activatedRouteSnapshot, [], []);

      await expect(firstValueFrom(breadcrumbs[0].title$!)).resolves.toEqual('core.breadcrumb.home');
    });

    it('should set dynamic i18n breadcrumb title ', async () => {
      const activatedRouteSnapshot: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
      activatedRouteSnapshot.url = [new UrlSegment('', {})];
      activatedRouteSnapshot.data = {
        breadcrumb: { i18n: (data: Data) => data.userId },
        userId: 'userId',
      };
      (activatedRouteSnapshot as any)['_routerState'] = { firstChild: () => null };

      const breadcrumbs = service['_buildBreadcrumbs'](activatedRouteSnapshot, [], []);

      await expect(firstValueFrom(breadcrumbs[0].title$!)).resolves.toEqual('core.breadcrumb.userId');
    });
  });

  it('should set breadcrumb icon', () => {
    const activatedRouteSnapshot: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
    activatedRouteSnapshot.url = [new UrlSegment('', {})];
    activatedRouteSnapshot.data = { breadcrumb: { icon: 'home', parentOffset: 3 } };
    (activatedRouteSnapshot as any)['_routerState'] = { firstChild: () => null };

    const breadcrumbs = service['_buildBreadcrumbs'](activatedRouteSnapshot, [], []);

    expect(breadcrumbs[0].icon).toEqual('home');
    expect(breadcrumbs[0].parentOffset).toEqual(3);
    expect(breadcrumbs[0].title$).toBeFalsy();
  });

  describe('Hook on Navigation End Events', () => {
    it('should build breadcrumbs on navigation end event', fakeAsync(async () => {
      const recursiveSpy = jest.spyOn<any, any>(service, '_buildBreadcrumbs');

      const root: ActivatedRouteSnapshot = new ActivatedRouteSnapshot();
      root.url = [new UrlSegment('home', {})];
      root.data = { breadcrumb: { title: 'title' } };
      (root as any)['_routerState'] = { firstChild: () => null };

      stubRouter.routerState = { snapshot: { root } } as any;

      (stubRouter as any).events.next(new NavigationEnd(0, '/', '/'));
      tick(100);

      expect(recursiveSpy).toHaveBeenCalledTimes(2);

      const breadcrumbs = await firstValueFrom(service.breadcrumbs$);

      await expect(breadcrumbs).toHaveLength(1);
      return expect(breadcrumbs[0].url).toEqual('home');
    }));
  });
});

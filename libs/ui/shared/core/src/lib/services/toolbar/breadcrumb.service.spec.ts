import { TestBed } from '@angular/core/testing';
import { Event, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { getTranslocoModule } from '@app/ui/testing';
import { firstValueFrom, of, Subject } from 'rxjs';
import { BreadcrumbService } from './breadcrumb.service';

const stubRouter = {
  events: new Subject<Partial<Event>>(),
};

describe('BreadcrumbService', () => {
  let service: BreadcrumbService;

  beforeEach(() => {
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

  describe('parentRoute$', () => {
    it('should get parent route', () => {
      const breadcrumb = [
        { title$: of('title'), url: '/url1' },
        { title$: of('title'), url: '/url2' },
        { title$: of('title'), url: '/url3' },
      ];
      service['_breadcrumbs$'].next(breadcrumb);

      expect(firstValueFrom(service.parentRoute$)).resolves.toEqual('/url2');
    });

    it('should get parent route with offset', () => {
      const breadcrumb = [
        { title$: of('title'), url: '/url1' },
        { title$: of('title'), url: '/url2' },
        { title$: of('title'), url: '/url3', parentOffset: 1 },
      ];
      service['_breadcrumbs$'].next(breadcrumb);

      expect(firstValueFrom(service.parentRoute$)).resolves.toEqual('/url1');
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
});

import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';

export class StubActivatedRoute implements Partial<ActivatedRoute> {
  params = of([]);
  data = of({});
  snapshot = { data: {} } as ActivatedRouteSnapshot;

  public static of(data: any = {}): StubActivatedRoute {
    const stubActivatedRoute = new StubActivatedRoute();
    stubActivatedRoute.data = of(data);
    stubActivatedRoute.snapshot.data = data;
    return stubActivatedRoute;
  }
}

export const StubRouteDataProvider = (data?: any) => ({
  provide: ActivatedRoute,
  useValue: StubActivatedRoute.of(data),
});

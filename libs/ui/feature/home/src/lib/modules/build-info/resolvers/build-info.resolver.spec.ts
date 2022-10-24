import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HalFormClientModule } from '@hal-form-client';
import { firstValueFrom, of } from 'rxjs';

import { BuildInfoResolver } from './build-info.resolver';

describe('BuildInfoResolver', () => {
  let resolver: BuildInfoResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientModule, HttpClientTestingModule],
    });
    resolver = TestBed.inject(BuildInfoResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve build info', async () => {
    jest.spyOn(resolver['buildInfoService'], 'getBuildInfo').mockReturnValueOnce(of({ version: '1.0.0-SNAPSHOT' }));
    return expect(firstValueFrom(resolver.resolve())).resolves.toEqual({ version: '1.0.0-SNAPSHOT' });
  });
});

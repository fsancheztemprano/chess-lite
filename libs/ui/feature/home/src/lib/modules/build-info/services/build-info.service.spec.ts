import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HalFormClientModule, HalFormService } from '@hal-form-client';
import { BuildInfoService } from './build-info.service';

describe('BuildInfoService', () => {
  let service: BuildInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientModule, HttpClientTestingModule],
    });
    service = TestBed.inject(BuildInfoService);
    TestBed.inject(HalFormService).setResource({
      _links: {
        self: { href: '/api' },
        'build-info': { href: '/api/build-info' },
      },
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get build info', (done) => {
    service.getBuildInfo().subscribe((buildInfo) => {
      expect(buildInfo).toEqual({ version: '1.0.0-SNAPSHOT' });
      done();
    });
    const testRequest = TestBed.inject(HttpTestingController).expectOne('/api/build-info');
    expect(testRequest.request.method).toEqual('GET');
    testRequest.flush({ version: '1.0.0-SNAPSHOT' });
  });
});

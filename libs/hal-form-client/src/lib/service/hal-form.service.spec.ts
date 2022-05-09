import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ContentType } from '../domain/domain';
import { IResource, Resource } from '../domain/resource';
import { HalFormClientModule } from '../hal-form-client.module';
import { HalFormService } from './hal-form.service';
import { noop } from 'rxjs';

describe('HalFormService', () => {
  let httpTestingController: HttpTestingController;
  let service: HalFormService;

  const mockResource: IResource = {
    _links: {
      self: {
        href: 'http://localhost:8888/api',
      },
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientModule.forRoot('/api'), HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(HalFormService);
  });

  afterEach(() => httpTestingController.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialize', () => {
    it('should initialize root resource', (done) => {
      service.initialize().subscribe({
        next: (resource) => {
          expect(resource).toBeTruthy();
          expect(service['_rootResource'].value).toBeTruthy();
          done();
        },
      });

      httpTestingController
        .expectOne('/api')
        .flush(mockResource, { headers: { 'Content-Type': ContentType.APPLICATION_JSON_HAL_FORMS } });
    });

    it('should handle initialization error', (done) => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();

      service.initialize().subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
          expect(service['_rootResource'].value).toBeTruthy();
          expect(errorSpy).toHaveBeenCalledWith(`Hal Form Service Initialization Error`, error);
          done();
        },
      });

      httpTestingController.expectOne('/api').flush({}, { status: 404, statusText: 'Not Found' });
      errorSpy.mockRestore();
    });
  });

  describe('fetchRootResource', () => {
    it('should fetch the root resource', (done) => {
      service.fetchRootResource().subscribe((resource: Resource) => {
        expect(resource).toBeTruthy();
        expect(resource.toJson()).toStrictEqual(mockResource);
        done();
      });

      httpTestingController
        .expectOne('/api')
        .flush(mockResource, { headers: { 'Content-Type': ContentType.APPLICATION_JSON_HAL_FORMS } });
    });

    it('should initialize the root resource on null body', (done) => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      service.fetchRootResource().subscribe((resource: Resource) => {
        expect(resource).toBeTruthy();
        expect(resource.toJson()).toStrictEqual({});
        expect(warnSpy).toHaveBeenCalledWith(`Provided url /api is not Hal Form Compliant`);
        done();
      });

      httpTestingController
        .expectOne('/api')
        .flush(null, { headers: { 'Content-Type': ContentType.APPLICATION_JSON_HAL } });
      warnSpy.mockRestore();
    });

    it('should warn if response is not hal compliant', (done) => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementationOnce(noop);
      const errorSpy = jest.spyOn(console, 'error').mockImplementationOnce(noop);

      service.fetchRootResource().subscribe((resource: Resource) => {
        expect(resource).toBeTruthy();
        expect(resource.toJson()).toStrictEqual(mockResource);
        expect(warnSpy).toHaveBeenCalledWith(`Provided url /api is not Hal Form Compliant`);
        expect(errorSpy).toHaveBeenCalledWith(`Provided url /api is not Hal Compliant`);
        done();
      });

      httpTestingController.expectOne('/api').flush(mockResource);
      warnSpy.mockRestore();
    });
  });
});

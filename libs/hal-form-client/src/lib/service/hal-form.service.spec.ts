import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ContentType } from '../domain/domain';
import { IResource, Resource } from '../domain/resource';
import { HalFormClientModule } from '../hal-form-client.module';
import { HalFormService } from './hal-form.service';

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
    it('should initialize the root resource', (done) => {
      service.initialize().subscribe((resource: Resource) => {
        expect(resource).toBeTruthy();
        expect(service['_rootResource'].value).toBe(resource);
        done();
      });

      httpTestingController
        .expectOne('/api')
        .flush(mockResource, { headers: { 'Content-Type': ContentType.APPLICATION_JSON_HAL_FORMS } });
    });

    it('should initialize the root resource on null body', (done) => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      service.initialize().subscribe((resource: Resource) => {
        expect(resource).toBeTruthy();
        expect(service['_rootResource'].value).toBe(resource);
        expect(warnSpy).toHaveBeenCalledWith(`Provided url /api is not Hal Form Compliant`);
        done();
      });

      httpTestingController
        .expectOne('/api')
        .flush(null, { headers: { 'Content-Type': ContentType.APPLICATION_JSON_HAL } });
      warnSpy.mockRestore();
    });

    it('should warn if response is not hal compliant', (done) => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      service.initialize().subscribe((resource: Resource) => {
        expect(resource).toBeTruthy();
        expect(service['_rootResource'].value).toBe(resource);
        expect(warnSpy).toHaveBeenCalledWith(`Provided url /api is not Hal Form Compliant`);
        expect(warnSpy).toHaveBeenCalledWith(`Provided url /api is not Hal Compliant`);
        done();
      });

      httpTestingController.expectOne('/api').flush(mockResource);
      warnSpy.mockRestore();
    });

    it('should handle initialization error', (done) => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation();

      service.initialize().subscribe({
        error: (error) => {
          expect(error).toBeTruthy();
          expect(service['_rootResource'].value).toBeTruthy();
          expect(errorSpy).toHaveBeenCalledWith(`Hal Form Client Initialization Error`, error);
          done();
        },
      });

      httpTestingController.expectOne('/api').flush({}, { status: 404, statusText: 'Not Found' });
      errorSpy.mockRestore();
    });
  });

  it('should set resource', (done) => {
    service.setResource(mockResource);

    service.getResource().subscribe((resource: Resource) => {
      expect(resource).toBeTruthy();
      expect(resource).toStrictEqual(new Resource(mockResource));
      done();
    });
  });

  it('should get resource once', (done) => {
    service.getResourceOnce().subscribe({
      next: (resource: Resource) => expect(resource).toBeTruthy(),
      complete: () => done(),
    });
  });

  it('should map to resource.hasLink', (done) => {
    const resourceSpy = jest.spyOn(service['_rootResource'].value, 'hasLink');

    service.hasLink('self').subscribe(() => {
      expect(resourceSpy).toHaveBeenCalledWith('self');
      done();
    });
  });

  it('should map to resource.getLink', (done) => {
    const resourceSpy = jest.spyOn(service['_rootResource'].value, 'getLink');

    service.getLink('self').subscribe(() => {
      expect(resourceSpy).toHaveBeenCalledWith('self');
      done();
    });
  });

  it('should map to resource.getLinkOrThrow', (done) => {
    service.setResource(mockResource);
    const resourceSpy = jest.spyOn(service['_rootResource'].value, 'getLinkOrThrow');

    service.getLinkOrThrow('self').subscribe(() => {
      expect(resourceSpy).toHaveBeenCalledWith('self', undefined);
      done();
    });
  });

  it('should map to resource.hasEmbedded', (done) => {
    const resourceSpy = jest.spyOn(service['_rootResource'].value, 'hasEmbedded');

    service.hasEmbedded('embedded').subscribe(() => {
      expect(resourceSpy).toHaveBeenCalledWith('embedded');
      done();
    });
  });

  it('should map to resource.hasEmbeddedObject', (done) => {
    const resourceSpy = jest.spyOn(service['_rootResource'].value, 'hasEmbeddedObject');

    service.hasEmbeddedObject('embedded').subscribe(() => {
      expect(resourceSpy).toHaveBeenCalledWith('embedded');
      done();
    });
  });

  it('should map to resource.hasEmbeddedCollection', (done) => {
    const resourceSpy = jest.spyOn(service['_rootResource'].value, 'hasEmbeddedCollection');

    service.hasEmbeddedCollection('embedded').subscribe(() => {
      expect(resourceSpy).toHaveBeenCalledWith('embedded');
      done();
    });
  });

  it('should map to resource.getEmbedded', (done) => {
    const resourceSpy = jest.spyOn(service['_rootResource'].value, 'getEmbedded');

    service.getEmbedded('embedded').subscribe(() => {
      expect(resourceSpy).toHaveBeenCalledWith('embedded');
      done();
    });
  });

  it('should map to resource.getEmbeddedObject', (done) => {
    service.setResource({ ...mockResource, _embedded: { embeddedObject: {} } });
    const resourceSpy = jest.spyOn(service['_rootResource'].value, 'getEmbeddedObject');

    service.getEmbeddedObject('embeddedObject').subscribe(() => {
      expect(resourceSpy).toHaveBeenCalledWith('embeddedObject');
      done();
    });
  });

  it('should map to resource.getEmbeddedCollection', (done) => {
    service.setResource({ ...mockResource, _embedded: { embeddedCollection: [] } });
    const resourceSpy = jest.spyOn(service['_rootResource'].value, 'getEmbeddedCollection');

    service.getEmbeddedCollection('embeddedCollection').subscribe(() => {
      expect(resourceSpy).toHaveBeenCalledWith('embeddedCollection');
      done();
    });
  });

  it('should map to resource.getTemplate', (done) => {
    const resourceSpy = jest.spyOn(service['_rootResource'].value, 'getTemplate');

    service.getTemplate('update').subscribe(() => {
      expect(resourceSpy).toHaveBeenCalledWith('update');
      done();
    });
  });

  it('should map to resource.getTemplateOrThrow', (done) => {
    service.setResource({ ...mockResource, _templates: { default: {}, update: { method: 'PATCH' } } });
    const resourceSpy = jest.spyOn(service['_rootResource'].value, 'getTemplateOrThrow');

    service.getTemplateOrThrow('update').subscribe(() => {
      expect(resourceSpy).toHaveBeenCalledWith('update');
      done();
    });
  });

  it('should map to resource.hasTemplate', (done) => {
    const resourceSpy = jest.spyOn(service['_rootResource'].value, 'hasTemplate');

    service.hasTemplate('update').subscribe(() => {
      expect(resourceSpy).toHaveBeenCalledWith('update');
      done();
    });
  });
});

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IResource, Resource } from '../domain/resource';
import { HalFormClientModule } from '../hal-form-client.module';
import { HalFormResourceService } from './hal-form-resource.service';

describe('HalFormResourceService', () => {
  let service: HalFormResourceService;

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
    service = TestBed.inject(HalFormResourceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set resource', () => {
    service.setResource(mockResource);

    service['_rootResource'].value === mockResource;
  });

  it('should get resource$', (done) => {
    service.setResource(mockResource);

    service.resource$.subscribe((resource: Resource) => {
      expect(resource).toBeTruthy();
      expect(resource).toStrictEqual(new Resource(mockResource));
      done();
    });
  });

  it('should get resource', () => {
    service.setResource(mockResource);

    expect(service.resource).toBeTruthy();
  });

  it('should get resource once', (done) => {
    service.resourceOnce$.subscribe({
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

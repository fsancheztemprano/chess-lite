import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HalFormClientModule } from '../hal-form-client.module';
import { HttpMethod } from './domain';
import { IResource, Resource } from './resource';

describe('Resource', () => {
  let httpTestingController: HttpTestingController;

  const iResource: IResource = {
    id: '1',
    _links: {
      self: { href: '/api/v1/users' },
      user: { href: '/api/v1/users/{userId}', templated: true },
    },
    _templates: {
      default: { method: HttpMethod.HEAD },
      update: { method: HttpMethod.PUT, properties: [{ name: 'name' }] },
      preferences: { method: HttpMethod.PUT, target: '/api/v1/users/1/preferences' },
    },
    _embedded: {
      preferences: { _links: { self: { href: '/api/v1/user/1/preferences' } }, locale: 'en' },
      roles: [
        {
          _links: { self: { href: '/api/v1/role/1' } },
          name: 'admin',
        },
        { _links: { self: { href: '/api/v1/role/2' } }, name: 'mod' },
      ],
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientModule, HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('should create', () => {
    expect(new Resource()).toBeTruthy();
    expect(Resource.of()).toBeTruthy();
  });

  describe('constructor', () => {
    it('should create with properties', () => {
      const resource = Resource.of(iResource);

      expect(resource).toBeTruthy();
      expect(resource.id).toEqual(iResource.id);
      expect(resource._links?.self.href).toEqual(iResource._links?.self.href);
      expect(resource._links?.user.href).toEqual(iResource._links?.user.href);
      expect(resource._templates?.default.method).toEqual(iResource._templates?.default.method);
      expect(resource._templates?.update.method).toEqual(iResource._templates?.update.method);
      expect(resource._templates?.preferences.method).toEqual(iResource._templates?.preferences.method);
      expect((resource._embedded?.preferences as IResource).locale).toEqual(
        (iResource._embedded?.preferences as IResource).locale,
      );
      expect((resource._embedded?.roles as IResource[]).length).toEqual(
        (iResource._embedded?.roles as IResource[]).length,
      );
    });

    it('should instantiate links', () => {
      const resource = Resource.of(iResource);

      expect(resource.getLink()).toBeTruthy();
      expect(resource.getLink('user')).toBeTruthy();
      expect(resource.getLink('missing')).toBeFalsy();
    });

    it('should instantiate templates', () => {
      const resource = Resource.of(iResource);

      expect(resource.getTemplate()).toBeTruthy();
      expect(resource.getTemplate('update')).toBeTruthy();
      expect(resource.getTemplate('preferences')).toBeTruthy();
      expect(resource.getTemplate('missing')).toBeFalsy();
    });

    it('should instantiate templates using self as target', () => {
      expect(Resource.of(iResource).getTemplate('update')?.target).toEqual(iResource._links?.self.href);
    });

    it('should instantiate templates using template specific target', () => {
      expect(Resource.of(iResource).getTemplate('preferences')?.target).toEqual(
        iResource._templates?.preferences.target,
      );
    });

    it('should instantiate embedded object', () => {
      const resource = Resource.of(iResource);

      expect(resource.getEmbedded('preferences')).toBeTruthy();
      expect(resource.getEmbedded('preferences')).toBeInstanceOf(Resource);
      expect(resource.getEmbeddedObject('preferences').getLink()).toBeTruthy();
      expect(resource.getEmbedded('missing')).toBeFalsy();
    });

    it('should instantiate embedded collection', () => {
      const resource = Resource.of(iResource);

      expect(resource.getEmbedded('roles')).toBeTruthy();
      expect(resource.getEmbedded('roles')).toBeInstanceOf(Array);
      expect(resource.getEmbeddedCollection('roles')).toHaveLength(2);
      expect(resource.getEmbeddedCollection('roles')[0]).toBeInstanceOf(Resource);
      expect(resource.getEmbeddedCollection('roles')[1]).toBeInstanceOf(Resource);
      expect(resource.getEmbedded('missing')).toBeFalsy();
    });
  });
});

import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HalFormClientModule } from '../hal-form-client.module';
import { ContentType } from './domain';
import { ILink, Link } from './link';
import { Resource } from './resource';

class MockResource extends Resource {
  id?: string;
}

describe('Link', () => {
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientModule, HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('should create', () => {
    expect(new Link({ href: 'http://example.com' })).toBeTruthy();
    expect(Link.of({ href: 'http://example.com' })).toBeTruthy();
    expect(Link.ofHref('http://example.com')).toBeTruthy();
  });

  it('should create with templated href', () => {
    const link = new Link({ href: '/api/v1/users/{userId}', templated: true });
    expect(link).toBeTruthy();
    expect(link.href).toBe('/api/v1/users/{userId}');
    expect(link.templated).toBe(true);
  });

  describe('get', () => {
    it('should fetch resource', (done) => {
      Link.ofHref('/api/ve/users/1')
        .get<{ id: string }>()
        .subscribe((response: HttpResponse<{ id: string }>) => {
          expect(response).toBeTruthy();
          expect(response.body).toBeTruthy();
          expect(response.body?.id).toBe('1');

          done();
        });

      const testRequest = httpTestingController.expectOne('/api/ve/users/1');
      expect(testRequest.request.headers.get('Accept')).toBe(ContentType.APPLICATION_JSON_HAL_FORMS);
      testRequest.flush({ id: '1' });
    });

    it('should fetch resource overriding headers', (done) => {
      Link.of({ href: '/api/ve/users/1' })
        .get<{ id: string }>({ headers: { Accept: ContentType.APPLICATION_JSON } })
        .subscribe((response: HttpResponse<{ id: string }>) => {
          expect(response).toBeTruthy();
          expect(response.body).toBeTruthy();
          expect(response.body?.id).toBe('1');

          done();
        });

      const testRequest = httpTestingController.expectOne('/api/ve/users/1');
      expect(testRequest.request.headers.get('Accept')).toBe(ContentType.APPLICATION_JSON);
      testRequest.flush({ id: '1' });
    });

    it('should parse parameters and fetch resource', (done) => {
      Link.ofHref('/api/ve/users/{userId}')
        .get<{ id: string }>({ parameters: { userId: '1' } })
        .subscribe((response: HttpResponse<{ id: string }>) => {
          expect(response).toBeTruthy();
          expect(response.body).toBeTruthy();
          expect(response.body?.id).toBe('1');

          done();
        });

      const testRequest = httpTestingController.expectOne('/api/ve/users/1');
      expect(testRequest.request.headers.get('Accept')).toBe(ContentType.APPLICATION_JSON_HAL_FORMS);
      testRequest.flush({ id: '1' });
    });
  });

  describe('follow', () => {
    it('should fetch and instantiate a new resource', (done) => {
      Link.ofHref('/api/v1/users/1')
        .follow<MockResource>()
        .subscribe((resource: MockResource) => {
          expect(resource).toBeTruthy();
          expect(resource).toBeInstanceOf(Resource);
          expect(resource.id).toBe('1');
          expect(resource.hasLink()).toBeTruthy();
          done();
        });

      httpTestingController.expectOne('/api/v1/users/1').flush({
        id: '1',
        _links: { self: { href: '/api/v1/users/1' } },
      });
    });

    it('should fetch and return an empty resource if response is empty', (done) => {
      Link.ofHref('/api/v1/users/1')
        .follow<MockResource>()
        .subscribe((resource: MockResource) => {
          expect(resource).toBeTruthy();
          expect(resource).toBeInstanceOf(Resource);
          expect(resource.hasLink()).toBeFalsy();
          done();
        });

      httpTestingController.expectOne('/api/v1/users/1').flush(null);
    });
  });

  describe('followRaw', () => {
    it('should fetch and map to body', (done) => {
      Link.ofHref('/api/v1/users/1')
        .followRaw<MockResource>()
        .subscribe((resource: MockResource) => {
          expect(resource).toBeTruthy();
          expect(resource).not.toBeInstanceOf(Resource);
          expect(resource.id).toBe('1');
          done();
        });

      httpTestingController.expectOne('/api/v1/users/1').flush({
        id: '1',
        _links: { self: { href: '/api/v1/users/1' } },
      });
    });

    it('should fetch and return an empty object if response is empty', (done) => {
      Link.ofHref('/api/v1/users/1')
        .followRaw<MockResource>()
        .subscribe((resource: MockResource) => {
          expect(resource).toBe(null);
          done();
        });

      httpTestingController.expectOne('/api/v1/users/1').flush(null);
    });
  });

  it('should parse to json', () => {
    const iLink: ILink = { href: '/api/v1/users/1', name: 'self' };

    expect(Link.of(iLink).toJson()).toEqual(iLink);
  });
});

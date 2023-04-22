import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HalFormClientModule } from '../hal-form-client.module';
import { ContentType, HttpMethod } from './domain';
import { Resource } from './resource';
import { ITemplate, Template } from './template';

class MockResource extends Resource {
  id?: string;
  name?: string;
}

describe('Template', () => {
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientModule, HttpClientTestingModule],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('should create', () => {
    expect(new Template({ method: HttpMethod.PATCH })).toBeTruthy();
    expect(Template.of({ method: HttpMethod.PATCH })).toBeTruthy();
  });

  it('should create with default method', () => {
    expect(new Template({}).method).toBe(HttpMethod.GET);
  });

  it('should create with template properties', () => {
    const iTemplate: ITemplate = {
      method: HttpMethod.PATCH,
      target: '/api/v1/users/1',
      title: 'Update User',
      contentType: ContentType.APPLICATION_JSON_HAL_FORMS,
      properties: [
        {
          name: 'firstName',
          type: 'string',
          required: true,
          readOnly: false,
        },
        {
          name: 'lastName',
          type: 'string',
          required: true,
          readOnly: false,
        },
      ],
    };
    expect(new Template(iTemplate)).toEqual(expect.objectContaining(iTemplate));
  });

  describe('Properties', () => {
    describe('get', () => {
      it('should return a property', () => {
        expect(
          new Template({
            properties: [
              {
                name: 'firstName',
                type: 'string',
              },
            ],
          }).getProperty('firstName'),
        ).toBeDefined();
      });

      it('should return undefined', () => {
        expect(
          new Template({
            properties: [
              {
                name: 'firstName',
                type: 'string',
              },
            ],
          }).getProperty('lastName'),
        ).toBeUndefined();
      });
    });

    describe('set', () => {
      it('should set a property', () => {
        const template = new Template({});
        template.setProperty('firstName', 'required', true);
        expect(template.getProperty('firstName')?.required).toBeTruthy();
      });

      it('should override a property', () => {
        const template = new Template({
          properties: [
            {
              name: 'firstName',
              type: 'string',
              required: false,
            },
          ],
        });
        template.setProperty('firstName', 'required', true);
        expect(template.getProperty('firstName')?.required).toBeTruthy();
      });

      it('should ', () => {
        const iTemplate: ITemplate = {
          properties: [
            {
              name: 'firstName',
              type: 'string',
              required: false,
            },
          ],
        };
        const template = new Template(iTemplate);
        template.setProperty('firstName', undefined as any, true);
        template.setProperty(undefined as any, 'required', true);
        expect(template).toEqual(expect.objectContaining(iTemplate));
      });
    });
  });

  describe('request', () => {
    it('should afford template', (done) => {
      Template.of({
        method: HttpMethod.PATCH,
        target: '/api/v1/users/1',
      })
        .request<MockResource>({ body: { name: 'new name' } })
        .subscribe((response: HttpResponse<MockResource>) => {
          expect(response).toBeTruthy();
          expect(response.body?.name).toBe('new name');
          done();
        });

      httpTestingController
        .expectOne((request) => {
          return (
            request.method === HttpMethod.PATCH &&
            request.url === '/api/v1/users/1' &&
            request.body?.name === 'new name' &&
            request.headers.keys().length === 2 &&
            request.headers.get('Content-type') === ContentType.APPLICATION_JSON &&
            request.headers.get('Accept') === ContentType.APPLICATION_JSON_HAL_FORMS
          );
        })
        .flush({ name: 'new name' });
    });

    it('should afford null template', (done) => {
      Template.of({
        method: HttpMethod.PATCH,
        target: '/api/v1/users/1',
      })
        .request<MockResource>()
        .subscribe((response: HttpResponse<MockResource>) => {
          expect(response).toBeTruthy();
          expect(response.body?.id).toEqual('1');
          done();
        });

      const request = httpTestingController.expectOne('/api/v1/users/1');
      request.flush({ id: '1' });
      expect(request.request.method).toBe(HttpMethod.PATCH);
      expect(request.request.body).toBeNull();
      expect(request.request.headers.keys().length).toBe(1);
      expect(request.request.headers.get('Accept')).toBe(ContentType.APPLICATION_JSON_HAL_FORMS);
    });

    describe('headers', () => {
      it('should afford template with accept hal forms header and content type json', (done) => {
        Template.of({
          method: HttpMethod.PATCH,
          target: '/api/v1/users/1',
        })
          .request<MockResource>({
            body: { name: 'new name' },
          })
          .subscribe((response: HttpResponse<MockResource>) => {
            expect(response).toBeTruthy();
            expect(response.body?.name).toBe('new name');
            done();
          });

        const request = httpTestingController.expectOne('/api/v1/users/1');
        request.flush({ name: 'new name' });

        expect(request.request.headers.keys().length).toBe(2);
        expect(request.request.headers.get('Accept')).toBe(ContentType.APPLICATION_JSON_HAL_FORMS);
        expect(request.request.headers.get('Content-type')).toBe(ContentType.APPLICATION_JSON);
        expect(request.request.method).toBe(HttpMethod.PATCH);
        expect(request.request.body).toEqual({ name: 'new name' });
      });

      it('should afford template with configured content type', (done) => {
        Template.of({
          method: HttpMethod.PATCH,
          target: '/api/v1/users/1',
          contentType: ContentType.APPLICATION_JSON_HAL,
        })
          .request<MockResource>({
            body: { name: 'new name' },
          })
          .subscribe((response: HttpResponse<MockResource>) => {
            expect(response).toBeTruthy();
            done();
          });

        const request = httpTestingController.expectOne('/api/v1/users/1');
        request.flush({ name: 'new name' });

        expect(request.request.headers.keys().length).toBe(2);
        expect(request.request.headers.get('Accept')).toBe(ContentType.APPLICATION_JSON_HAL_FORMS);
        expect(request.request.headers.get('Content-type')).toBe(ContentType.APPLICATION_JSON_HAL);
        expect(request.request.body).toEqual({ name: 'new name' });
      });

      it('should afford template with text plain content', (done) => {
        Template.of({
          method: HttpMethod.PATCH,
          target: '/api/v1/users/1',
        })
          .request<MockResource>({
            body: 'new name',
          })
          .subscribe((response: HttpResponse<MockResource>) => {
            expect(response).toBeTruthy();
            done();
          });

        const request = httpTestingController.expectOne('/api/v1/users/1');
        request.flush({ name: 'new name' });

        expect(request.request.headers.keys().length).toBe(2);
        expect(request.request.headers.get('Accept')).toBe(ContentType.APPLICATION_JSON_HAL_FORMS);
        expect(request.request.headers.get('Content-type')).toBe(ContentType.TEXT_PLAIN);
        expect(request.request.body).toBe('new name');
      });

      it('should afford template with blob content type', (done) => {
        const body = new Blob(['new name']);
        Template.of({
          method: HttpMethod.PATCH,
          target: '/api/v1/users/1',
        })
          .request<MockResource>({
            body,
          })
          .subscribe((response: HttpResponse<MockResource>) => {
            expect(response).toBeTruthy();
            done();
          });

        const request = httpTestingController.expectOne('/api/v1/users/1');
        request.flush({ name: 'new name' });

        expect(request.request.headers.keys().length).toBe(2);
        expect(request.request.headers.get('Accept')).toBe(ContentType.APPLICATION_JSON_HAL_FORMS);
        expect(request.request.headers.get('Content-type')).toBe(ContentType.APPLICATION_OCTET_STREAM);
        expect(request.request.body).toBe(body);
      });

      it('should afford template with multipart form data content type', (done) => {
        const file = new File(['new name'], 'new name.txt');
        const body = new FormData();
        body.append('avatar', file);
        Template.of({
          method: HttpMethod.PATCH,
          target: '/api/v1/users/1',
        })
          .request<MockResource>({
            body,
          })
          .subscribe((response: HttpResponse<MockResource>) => {
            expect(response).toBeTruthy();
            done();
          });

        const request = httpTestingController.expectOne('/api/v1/users/1');
        request.flush({ name: 'new name' });

        expect(request.request.headers.keys().length).toBe(1);
        expect(request.request.headers.get('Accept')).toBe(ContentType.APPLICATION_JSON_HAL_FORMS);
        expect(request.request.headers.get('Content-type')).toBeFalsy();
        expect(request.request.body).toBe(body);
      });

      it('should afford template custom headers object', () => {
        Template.of({
          method: HttpMethod.PATCH,
          target: '/api/v1/users/1',
        })
          .request<MockResource>({
            headers: { 'X-Header': 'value' },
          })
          .subscribe();

        const request = httpTestingController.expectOne('/api/v1/users/1');
        request.flush({ name: 'new name' });

        expect(request.request.headers.keys().length).toBe(2);
        expect(request.request.headers.get('Accept')).toBe(ContentType.APPLICATION_JSON_HAL_FORMS);
        expect(request.request.headers.get('X-Header')).toBe('value');
      });

      it('should afford template with HttpHeaders object merged', () => {
        const headers = new HttpHeaders({
          'X-Header': 'value',
        });
        Template.of({
          method: HttpMethod.PATCH,
          target: '/api/v1/users/1',
        })
          .request<MockResource>({
            headers,
          })
          .subscribe();

        const request = httpTestingController.expectOne('/api/v1/users/1');
        request.flush({ name: 'new name' });

        expect(request.request.headers.keys().length).toBe(2);
        expect(request.request.headers.get('Accept')).toBe(ContentType.APPLICATION_JSON_HAL_FORMS);
        expect(request.request.headers.get('X-Header')).toBe('value');
      });
    });

    it('should parse target and afford template', (done) => {
      Template.of({
        method: HttpMethod.PATCH,
        target: '/api/v1/users/{userId}',
      })
        .request<MockResource>({ body: { name: 'new name' }, parameters: { userId: 1 } })
        .subscribe((response: HttpResponse<MockResource>) => {
          expect(response).toBeTruthy();
          expect(response.body?.name).toBe('new name');
          done();
        });

      httpTestingController
        .expectOne((request) => {
          return (
            request.method === HttpMethod.PATCH &&
            request.url === '/api/v1/users/1' &&
            request.body?.name === 'new name'
          );
        })
        .flush({ name: 'new name' });
    });

    it('should throw error when no target available', (done: jest.DoneCallback) => {
      Template.of({ method: 'UNSUPPORTED', target: '' })
        .request()
        .subscribe({
          error: (error) => {
            expect(error).toBeTruthy();
            expect(error.message).toBe(`Template has no target`);
            done();
          },
        });
    });

    it('should throw error when using unsupported method', (done: jest.DoneCallback) => {
      Template.of({ method: 'UNSUPPORTED', target: '/api/v1/users/1' })
        .request()
        .subscribe({
          error: (error) => {
            expect(error).toBeTruthy();
            expect(error.message).toBe(`Http Method UNSUPPORTED not supported`);
            done();
          },
        });
    });
  });

  describe('afford', () => {
    it('should afford and instantiate the response', () => {
      Template.of({
        method: HttpMethod.PATCH,
        target: '/api/v1/users/1',
      })
        .afford<MockResource>({ body: { name: 'new name' } })
        .subscribe((resource: MockResource) => {
          expect(resource).toBeTruthy();
          expect(resource).toBeInstanceOf(Resource);
          expect(resource.body?.name).toBe('new name');
          expect(resource.hasLink()).toBeTruthy();
        });

      httpTestingController
        .expectOne((request) => {
          return (
            request.method === HttpMethod.PATCH &&
            request.url === '/api/v1/users/1' &&
            request.body?.name === 'new name' &&
            request.headers.get('Content-type') === ContentType.APPLICATION_JSON
          );
        })
        .flush({ name: 'new name', _links: { self: { href: '/api/v1/users/1' } } });
    });

    it('should afford and return an empty resource if response is empty', () => {
      Template.of({
        method: HttpMethod.PATCH,
        target: '/api/v1/users/1',
      })
        .afford<MockResource>({ body: { name: 'new name' } })
        .subscribe((resource: MockResource) => {
          expect(resource).toBeTruthy();
          expect(resource).toBeInstanceOf(Resource);
          expect(resource.hasLink()).toBeFalsy();
        });

      httpTestingController
        .expectOne((request) => {
          return (
            request.method === HttpMethod.PATCH &&
            request.url === '/api/v1/users/1' &&
            request.body?.name === 'new name' &&
            request.headers.get('Content-type') === ContentType.APPLICATION_JSON
          );
        })
        .flush(null);
    });
  });

  describe('canAfford', () => {
    it('should return true when no properties', () => {
      expect(Template.of({}).canAfford({ username: 'username' })).toBeTruthy();
    });

    it('should return true for readonly property', () => {
      const readOnlyTemplate = Template.of({ properties: [{ name: 'username', readOnly: true }] });

      expect(readOnlyTemplate.canAfford({ name: 'name', username: 'username' })).toBeTruthy();
    });

    describe('required', () => {
      const requiredTemplate = Template.of({ properties: [{ name: 'username', required: true }] });

      it('should return true if required property is provided', () => {
        expect(requiredTemplate.canAfford({ username: 'new username' })).toBeTruthy();
      });

      it.each(['', ' ', 0, [], ['']])(
        'should return true if required property is provided and nullish: %p',
        (nullish) => {
          expect(requiredTemplate.canAfford({ username: nullish })).toBeTruthy();
        },
      );

      it('should return false if required property is undefined', () => {
        expect(requiredTemplate.canAfford({ username: undefined })).toBeFalsy();
      });

      it('should return false if required property is not provided', () => {
        expect(requiredTemplate.canAfford({ lastname: 'new lastname' })).toBeFalsy();
      });
    });

    describe('regex', () => {
      const regexTemplate = Template.of({ properties: [{ name: 'username', regex: '^[a-zA-Z]+$' }] });

      it('should return true if provided value matches regex property', () => {
        expect(regexTemplate.canAfford({ username: 'newusername' })).toBeTruthy();
      });

      it('should return false if provided value does not match regex property', () => {
        expect(regexTemplate.canAfford({ username: 'newusername0' })).toBeFalsy();
      });

      it('should return true if regex property has no provided value', () => {
        expect(regexTemplate.canAfford({})).toBeTruthy();
      });
    });

    describe('value', () => {
      const valueTemplate = Template.of({ properties: [{ name: 'username' }] });

      it('should return true if provided property is valid', () => {
        expect(valueTemplate.canAffordProperty('username', 'JohnDoe')).toBeTruthy();
      });

      it('should return false if provided property is not valid', () => {
        expect(valueTemplate.canAffordProperty('email', 'JohnDoe@example.com')).toBeFalsy();
      });

      it('should return false if provided property is null', () => {
        expect(valueTemplate.canAffordProperty(undefined, 'JohnDoe')).toBeFalsy();
      });
    });

    describe('min', () => {
      const minTemplate = Template.of({ properties: [{ name: 'year', min: 2000 }] });

      it('should return true if provided property is at least equal to min', () => {
        expect(minTemplate.canAffordProperty('year', 2000)).toBeTruthy();
        expect(minTemplate.canAffordProperty('year', 2001)).toBeTruthy();
      });

      it('should return false if provided property less than min', () => {
        expect(minTemplate.canAffordProperty('year', 1999)).toBeFalsy();
      });
    });

    describe('max', () => {
      const maxTemplate = Template.of({ properties: [{ name: 'year', max: 2000 }] });

      it('should return true if provided property is at most equal to max', () => {
        expect(maxTemplate.canAffordProperty('year', 2000)).toBeTruthy();
        expect(maxTemplate.canAffordProperty('year', 1999)).toBeTruthy();
      });

      it('should return false if provided property greater than max', () => {
        expect(maxTemplate.canAffordProperty('year', 2001)).toBeFalsy();
      });
    });

    describe('minLength', () => {
      const minLengthTemplate = Template.of({ properties: [{ name: 'username', minLength: 3 }] });

      it('should return true if provided property length is at least equal to min length', () => {
        expect(minLengthTemplate.canAffordProperty('username', 'abc')).toBeTruthy();
        expect(minLengthTemplate.canAffordProperty('username', 'abcd')).toBeTruthy();
        expect(minLengthTemplate.canAffordProperty('username', ['a', 'b', 'c'])).toBeTruthy();
        expect(minLengthTemplate.canAffordProperty('username', ['a', 'b', 'c', 'd'])).toBeTruthy();
      });

      it('should return false if provided property length is less than min length', () => {
        expect(minLengthTemplate.canAffordProperty('username', 'ab')).toBeFalsy();
        expect(minLengthTemplate.canAffordProperty('username', ['a', 'b'])).toBeFalsy();
      });
    });

    describe('maxLength', () => {
      const maxLengthTemplate = Template.of({ properties: [{ name: 'username', maxLength: 3 }] });

      it('should return true if provided property length is at most equal to max length', () => {
        expect(maxLengthTemplate.canAffordProperty('username', 'abc')).toBeTruthy();
        expect(maxLengthTemplate.canAffordProperty('username', 'ab')).toBeTruthy();
        expect(maxLengthTemplate.canAffordProperty('username', ['a', 'b', 'c'])).toBeTruthy();
        expect(maxLengthTemplate.canAffordProperty('username', ['a', 'b'])).toBeTruthy();
      });

      it('should return false if provided property length is greater than max length', () => {
        expect(maxLengthTemplate.canAffordProperty('username', 'abcd')).toBeFalsy();
        expect(maxLengthTemplate.canAffordProperty('username', ['a', 'b', 'c', 'd'])).toBeFalsy();
      });
    });

    describe('step', () => {
      const stepTemplate = Template.of({ properties: [{ name: 'year', step: 2 }] });

      it('should return true if provided property is a multiple of step', () => {
        expect(stepTemplate.canAffordProperty('year', 2000)).toBeTruthy();
        expect(stepTemplate.canAffordProperty('year', 2002)).toBeTruthy();
      });

      it('should return false if provided property is not a multiple of step', () => {
        expect(stepTemplate.canAffordProperty('year', 2001)).toBeFalsy();
      });
    });
  });

  it('should parse to json', () => {
    const iTemplate: ITemplate = {
      method: HttpMethod.GET,
      target: '/api/v1/users/1',
      properties: [{ name: 'username' }],
      title: 'update',
    };

    expect(Template.of(iTemplate).toJson()).toEqual(iTemplate);
  });
});

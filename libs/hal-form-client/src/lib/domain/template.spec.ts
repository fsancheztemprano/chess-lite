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
      expect(
        Template.of({
          properties: [
            {
              name: 'username',
              readOnly: true,
            },
          ],
        }).canAfford({ name: 'name', username: 'username' }),
      ).toBeTruthy();
    });

    it('should return true if required property is provided', () => {
      expect(
        Template.of({
          properties: [
            {
              name: 'username',
              required: true,
            },
          ],
        }).canAfford({ username: 'new username' }),
      ).toBeTruthy();
    });

    it.each(['', ' ', 0, [], ['']])(
      'should return true if required property is provided and nullish: %p',
      (nullish) => {
        expect(
          Template.of({
            properties: [
              {
                name: 'username',
                required: true,
              },
            ],
          }).canAfford({ username: nullish }),
        ).toBeTruthy();
      },
    );

    it('should return false if required property is undefined', () => {
      expect(
        Template.of({
          properties: [
            {
              name: 'username',
              required: true,
            },
          ],
        }).canAfford({ username: undefined }),
      ).toBeFalsy();
    });

    it('should return false if required property is not provided', () => {
      expect(
        Template.of({
          properties: [
            {
              name: 'username',
              required: true,
            },
          ],
        }).canAfford({ lastname: 'new lastname' }),
      ).toBeFalsy();
    });

    it('should return true if provided value matches regex property', () => {
      expect(
        Template.of({
          properties: [
            {
              name: 'username',
              regex: '^[a-zA-Z]+$',
            },
          ],
        }).canAfford({ username: 'newusername' }),
      ).toBeTruthy();
    });

    it('should return false if provided value does not match regex property', () => {
      expect(
        Template.of({
          properties: [
            {
              name: 'username',
              regex: '^[a-zA-Z]+$',
            },
          ],
        }).canAfford({ username: 'newusername0' }),
      ).toBeFalsy();
    });

    it('should return true if regex property has no provided value', () => {
      expect(
        Template.of({
          properties: [
            {
              name: 'username',
              regex: '^[a-zA-Z]+$',
            },
          ],
        }).canAfford({}),
      ).toBeTruthy();
    });

    it('should return true if provided property is valid', () => {
      expect(
        Template.of({
          properties: [{ name: 'username' }],
        }).canAffordProperty('username', 'JohnDoe'),
      ).toBeTruthy();
    });

    it('should return false if provided property is not valid', () => {
      expect(
        Template.of({
          properties: [{ name: 'password' }],
        }).canAffordProperty('username', 'JohnDoe'),
      ).toBeFalsy();
    });

    it('should return false if provided property is null', () => {
      expect(
        Template.of({
          properties: [{ name: 'password' }],
        }).canAffordProperty(undefined, 'JohnDoe'),
      ).toBeFalsy();
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

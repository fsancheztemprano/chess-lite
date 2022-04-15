import { HttpResponse } from '@angular/common/http';
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

  describe('afford', () => {
    it('should afford template', (done) => {
      Template.of({
        method: HttpMethod.PATCH,
        target: '/api/v1/users/1',
      })
        .afford<MockResource>({ body: { name: 'new name' } })
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
        .afford<MockResource>()
        .subscribe((response: HttpResponse<MockResource>) => {
          expect(response).toBeTruthy();
          expect(response.body?.id).toEqual('1');
          done();
        });

      httpTestingController
        .expectOne((request) => {
          return (
            request.method === HttpMethod.PATCH &&
            request.url === '/api/v1/users/1' &&
            request.body === null &&
            request.headers.keys().length === 1 &&
            request.headers.get('Accept') === ContentType.APPLICATION_JSON_HAL_FORMS
          );
        })
        .flush({ id: '1' });
    });

    it('should afford template overriding headers', (done) => {
      Template.of({
        method: HttpMethod.PATCH,
        target: '/api/v1/users/1',
      })
        .afford<MockResource>({
          body: { name: 'new name' },
          headers: { 'Content-type': ContentType.APPLICATION_JSON_HAL_FORMS },
        })
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
            request.headers.get('Content-type') === ContentType.APPLICATION_JSON_HAL_FORMS
          );
        })
        .flush({ name: 'new name' });
    });

    it('should parse target and afford template', (done) => {
      Template.of({
        method: HttpMethod.PATCH,
        target: '/api/v1/users/{userId}',
      })
        .afford<MockResource>({ body: { name: 'new name' }, params: { userId: 1 } })
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

    it.each<any | jest.DoneCallback>(['', null, undefined])(
      'should throw error when %p target',
      (falsy, done: jest.DoneCallback) => {
        Template.of({ target: falsy })
          .afford()
          .subscribe({
            error: (error) => {
              expect(error).toBeTruthy();
              expect(error.message).toBe('Template has no target');
              done();
            },
          });
      },
    );
  });

  describe('submit', () => {
    it('should submit and instantiate the response', () => {
      Template.of({
        method: HttpMethod.PATCH,
        target: '/api/v1/users/1',
      })
        .submit<MockResource>({ body: { name: 'new name' } })
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

    it('should submit and return an empty resource if response is empty', () => {
      Template.of({
        method: HttpMethod.PATCH,
        target: '/api/v1/users/1',
      })
        .submit<MockResource>({ body: { name: 'new name' } })
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

  describe('isAllowedTo', () => {
    it('should return true when no properties', () => {
      expect(Template.of({}).isAllowedTo({ username: 'username' })).toBeTruthy();
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
        }).isAllowedTo({ name: 'name', username: 'username' }),
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
        }).isAllowedTo({ username: 'new username' }),
      ).toBeTruthy();
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
        }).isAllowedTo({ lastname: 'new lastname' }),
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
        }).isAllowedTo({ username: 'newusername' }),
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
        }).isAllowedTo({ username: 'newusername0' }),
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
        }).isAllowedTo({}),
      ).toBeTruthy();
    });
  });
});

import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AuthRelations, SignupInput } from '@app/domain';
import { HalFormClientModule, HalFormService } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { AuthService } from 'apps/app/src/app/auth/services/auth.service';
import { stubSessionServiceProvider } from 'apps/app/src/app/core/services/session.service.stub';
import { Signup } from 'libs/consumer-pact/src/test/authentication/authentication.pact';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { pactForResource } from '../../utils/pact.utils';

const provider: Pact = pactForResource('authentication');

describe('Authentication Pacts', () => {
  let halFormService: HalFormService;
  let service: AuthService;

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HalFormClientModule],
      providers: [avengersAssemble(provider.mockService.baseUrl), AuthService, stubSessionServiceProvider],
    });
    halFormService = TestBed.inject(HalFormService);
    service = TestBed.inject(AuthService);
  });

  describe('signup', () => {
    beforeEach(() => {
      halFormService.setRootResource({
        _links: {
          self: {
            href: '/api',
          },
          [AuthRelations.LOGIN_RELATION]: {
            href: '/api/auth/signup',
          },
        },
        _templates: {
          default: {},
          [AuthRelations.SIGNUP_RELATION]: {
            method: 'POST',
            properties: [
              {
                name: 'email',
                type: 'email',
              },
              {
                name: 'firstname',
                type: 'text',
              },
              {
                name: 'lastname',
                type: 'text',
              },
              {
                name: 'username',
                required: true,
                minLength: 5,
                maxLength: 128,
                type: 'text',
              },
            ],
            target: '/api/auth/signup',
          },
        },
      });
    });

    it('successful', (done) => {
      provider.addInteraction(Signup.successful).then(() => {
        service.signup({ username: 'username2', email: 'username2@example.com' }).subscribe(() => {
          done();
        });
      });
    });

    it('no email error', (done) => {
      const interaction: InteractionObject = Signup.no_email;
      provider.addInteraction(interaction).then(() => {
        service.signup(<SignupInput>{ username: 'username2' }).subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('existing email error', (done) => {
      const interaction: InteractionObject = Signup.existing_email;
      provider.addInteraction(interaction).then(() => {
        service.signup({ username: 'username0', email: 'username1@example.com' }).subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('no username error', (done) => {
      const interaction: InteractionObject = Signup.no_username;
      provider.addInteraction(interaction).then(() => {
        service.signup(<SignupInput>{ email: 'username2@example.com' }).subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('existing username error', (done) => {
      const interaction: InteractionObject = Signup.existing_username;
      provider.addInteraction(interaction).then(() => {
        service.signup({ username: 'username1', email: 'username0@example.com' }).subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(interaction.willRespondWith.status);
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });
  });
});

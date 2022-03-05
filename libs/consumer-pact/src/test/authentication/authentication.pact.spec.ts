import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AuthRelations, HttpHeaders, SignupInput } from '@app/domain';
import { HalFormClientModule, HalFormService } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { MatcherResult } from '@pact-foundation/pact/src/dsl/matchers';
import { AuthService } from 'apps/app/src/app/auth/services/auth.service';
import { stubSessionServiceProvider } from 'apps/app/src/app/core/services/session.service.stub';
import { LoginPact, SignupPact } from 'libs/consumer-pact/src/test/authentication/authentication.pact';
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
          [AuthRelations.SIGNUP_RELATION]: {
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
      provider.addInteraction(SignupPact.successful).then(() => {
        service.signup({ username: 'janeDoe', email: 'janeDoe@example.com' }).subscribe(() => {
          done();
        });
      });
    });

    it('no email error', (done) => {
      const interaction: InteractionObject = SignupPact.no_email;
      provider.addInteraction(interaction).then(() => {
        service.signup(<SignupInput>{ username: 'username1' }).subscribe({
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
      const interaction: InteractionObject = SignupPact.existing_email;
      provider.addInteraction(interaction).then(() => {
        service.signup({ username: 'username2', email: 'johnDoe@example.com' }).subscribe({
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
      const interaction: InteractionObject = SignupPact.no_username;
      provider.addInteraction(interaction).then(() => {
        service.signup(<SignupInput>{ email: 'username3@example.com' }).subscribe({
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
      const interaction: InteractionObject = SignupPact.existing_username;
      provider.addInteraction(interaction).then(() => {
        service.signup({ username: 'johnDoe', email: 'username4@example.com' }).subscribe({
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

  describe('login', () => {
    beforeEach(() => {
      halFormService.setRootResource({
        _links: {
          self: {
            href: '/api',
          },
          [AuthRelations.LOGIN_RELATION]: {
            href: '/api/auth/login',
          },
        },
        _templates: {
          default: {},
          [AuthRelations.LOGIN_RELATION]: {
            method: 'POST',
            properties: [
              {
                name: 'password',
                required: true,
                minLength: 6,
                maxLength: 128,
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
            target: '/api/auth/login',
          },
        },
      });
    });

    it('locked role', (done) => {
      const interaction: InteractionObject = LoginPact.locked_role;
      provider.addInteraction(interaction).then(() => {
        service.login({ username: 'lockedRoleUser', password: 'lockedRoleUser' }).subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(401);
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('locked user', (done) => {
      const interaction: InteractionObject = LoginPact.locked_user;
      provider.addInteraction(interaction).then(() => {
        service.login({ username: 'lockedUser', password: 'lockedUser' }).subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(401);
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('successful', (done) => {
      const interaction: InteractionObject = LoginPact.successful;
      provider.addInteraction(interaction).then(() => {
        service.login({ username: 'johnDoe', password: 'johnDoe0' }).subscribe((session) => {
          expect(session).toBeTruthy();
          expect(session?.token).toBe(
            (<MatcherResult>interaction.willRespondWith.headers?.[HttpHeaders.JWT_TOKEN]).getValue(),
          );
          expect(session?.user?.id).toBe(interaction.willRespondWith.body.id);
          done();
        });
      });
    });
  });
});

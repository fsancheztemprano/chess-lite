import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivationTokenRelations, AuthRelations, HttpHeaderKey, SignupInput } from '@app/domain';
import { HalFormClientModule, HalFormService } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { MatcherResult } from '@pact-foundation/pact/src/dsl/matchers';
import { AuthService } from 'apps/app/src/app/auth/services/auth.service';
import { stubSessionServiceProvider } from 'apps/app/src/app/core/services/session.service.stub';
import {
  ActivateAccountPact,
  ActivationTokenPact,
  LoginPact,
  SignupPact,
} from 'libs/consumer-pact/src/pact/authentication/authentication.pact';
import { ActivationTokenService } from '../../../../../apps/app/src/app/auth/services/activation-token.service';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { pactForResource } from '../../utils/pact.utils';

const provider: Pact = pactForResource('authentication');

describe('Authentication Pacts', () => {
  let halFormService: HalFormService;
  let authService: AuthService;
  let activationTokenService: ActivationTokenService;

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HalFormClientModule],
      providers: [avengersAssemble(provider.mockService.baseUrl), AuthService, stubSessionServiceProvider],
    });
    halFormService = TestBed.inject(HalFormService);
    authService = TestBed.inject(AuthService);
    activationTokenService = TestBed.inject(ActivationTokenService);
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
        authService.signup({ username: 'janeDoe', email: 'janeDoe@localhost' }).subscribe(() => {
          done();
        });
      });
    });

    it('no email error', (done) => {
      const interaction: InteractionObject = SignupPact.no_email;
      provider.addInteraction(interaction).then(() => {
        authService.signup(<SignupInput>{ username: 'username1' }).subscribe({
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
        authService.signup({ username: 'username2', email: 'pactUser@localhost' }).subscribe({
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
        authService.signup(<SignupInput>{ email: 'username3@localhost' }).subscribe({
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
        authService.signup({ username: 'pactUser', email: 'username4@localhost' }).subscribe({
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
        authService.login({ username: 'lockedRoleUser', password: 'lockedRoleUser' }).subscribe({
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
        authService.login({ username: 'lockedUser', password: 'lockedUser' }).subscribe({
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
        authService.login({ username: 'pactUser', password: 'pactUser0' }).subscribe((session) => {
          expect(session).toBeTruthy();
          expect(session?.token).toBe(
            (<MatcherResult>interaction.willRespondWith.headers?.[HttpHeaderKey.JWT_TOKEN]).getValue(),
          );
          expect(session?.user?.id).toBe(interaction.willRespondWith.body.id);
          done();
        });
      });
    });
  });

  describe('Activation token', () => {
    beforeEach(() => {
      halFormService.setRootResource({
        _links: {
          self: {
            href: '/api',
          },
          [ActivationTokenRelations.ACTIVATION_TOKEN_REL]: {
            href: '/api/auth/login',
          },
        },
        _templates: {
          default: {},
          [ActivationTokenRelations.REQUEST_ACTIVATION_TOKEN_REL]: {
            method: 'POST',
            properties: [
              {
                name: 'email',
                required: true,
                type: 'email',
              },
            ],
            target: '/api/auth/token',
          },
        },
      });
    });

    it('email not found', (done) => {
      const interaction: InteractionObject = ActivationTokenPact.not_found;
      provider.addInteraction(interaction).then(() => {
        activationTokenService.requestActivationToken('notFound@localhost').subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error).toBeTruthy();
            expect(error.status).toBe(404);
            expect(error.error).toMatchObject(interaction.willRespondWith.body);
            done();
          },
        });
      });
    });

    it('successful', (done) => {
      provider.addInteraction(ActivationTokenPact.successful).then(() => {
        activationTokenService.requestActivationToken('lockedRoleUser@localhost').subscribe(() => done());
      });
    });
  });

  describe('Activate account', () => {
    beforeEach(() => {
      halFormService.setRootResource({
        _links: {
          self: {
            href: '/api',
          },
          [ActivationTokenRelations.ACTIVATE_ACCOUNT_LINK]: {
            href: '/api/auth/activate',
          },
        },
        _templates: {
          default: {},
          [ActivationTokenRelations.ACTIVATE_ACCOUNT_REL]: {
            method: 'POST',
            properties: [
              {
                name: 'email',
                required: true,
                type: 'email',
              },
              {
                name: 'password',
                required: true,
                minLength: 8,
                maxLength: 128,
                type: 'text',
              },
              {
                name: 'token',
                required: true,
                minLength: 8,
                maxLength: 128,
                type: 'text',
              },
            ],
            target: '/api/auth/activate',
          },
        },
      });
    });

    it('not found', (done) => {
      const interaction: InteractionObject = ActivateAccountPact.not_found;
      provider.addInteraction(interaction).then(() => {
        activationTokenService
          .activateAccount({ password: 'notFoundPassword', token: 'notFoundTokenId', email: 'notFound@localhost' })
          .subscribe({
            error: (error: HttpErrorResponse) => {
              expect(error).toBeTruthy();
              expect(error.status).toBe(404);
              expect(error.error).toMatchObject(interaction.willRespondWith.body);
              done();
            },
          });
      });
    });

    it('successful', (done) => {
      provider.addInteraction(ActivateAccountPact.successful).then(() => {
        activationTokenService
          .activateAccount({
            password: 'activationUser',
            token: 'activationUserTokenId',
            email: 'activationUser@localhost',
          })
          .subscribe((response) => {
            expect(response).toBeTruthy();
            done();
          });
      });
    });
  });
});

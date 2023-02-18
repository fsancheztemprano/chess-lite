import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { stubSessionServiceProvider } from '@app/ui/shared/app';
import { AuthRelations, SignupInput } from '@app/ui/shared/domain';
import { HalFormClientModule, HalFormService } from '@hal-form-client';
import { PactV3, V3Interaction } from '@pact-foundation/pact';
import { catchError, firstValueFrom, of } from 'rxjs';
import { ActivationTokenService } from '../../../../ui/feature/authentication/src/lib/services/activation-token.service';
import { AuthService } from '../../../../ui/feature/authentication/src/lib/services/auth.service';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { executeInteractionTest, pactForResource } from '../../utils/pact.utils';
import { LoginPact, SignupPact } from './authentication.pact';

const provider: PactV3 = pactForResource('authentication');

describe('Authentication Pacts', () => {
  let halFormService: HalFormService;
  let authService: AuthService;
  let activationTokenService: ActivationTokenService;

  // beforeAll(() => provider.setup());
  // afterEach(() => provider.verify());
  // afterAll(() => provider.finalize());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HalFormClientModule],
      providers: [avengersAssemble(), AuthService, stubSessionServiceProvider],
    });
    halFormService = TestBed.inject(HalFormService);
    authService = TestBed.inject(AuthService);
    activationTokenService = TestBed.inject(ActivationTokenService);
  });

  describe('signup', () => {
    beforeEach(() => {
      halFormService?.setResource({
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

    it('successful ', () => {
      return executeInteractionTest(provider, SignupPact.successful, async () => {
        return await firstValueFrom(authService.signup({ username: 'janeDoe', email: 'janeDoe@localhost' }));
      });
    });
    it('no email error', () => {
      const interaction: V3Interaction = SignupPact.no_email;
      return executeInteractionTest(provider, interaction, async () => {
        return await firstValueFrom(
          authService.signup(<SignupInput>{ username: 'username1' }).pipe(
            catchError((error: HttpErrorResponse) => {
              expect(error).toBeTruthy();
              expect(error.status).toBe(interaction.willRespondWith.status);
              expect(error.error).toMatchObject(interaction.willRespondWith.body!);
              return of(void 0);
            }),
          ),
        );
      });
    });

    it('existing email error', () => {
      const interaction: V3Interaction = SignupPact.existing_email;
      return executeInteractionTest(provider, interaction, async () => {
        return await firstValueFrom(
          authService
            .signup({
              username: 'username2',
              email: 'pactUser@localhost',
            })
            .pipe(
              catchError((error: HttpErrorResponse) => {
                expect(error).toBeTruthy();
                expect(error.status).toBe(interaction.willRespondWith.status);
                expect(error.error).toMatchObject(interaction.willRespondWith.body!);
                return of(void 0);
              }),
            ),
        );
      });
    });

    it('no username error', () => {
      const interaction: V3Interaction = SignupPact.no_username;
      return executeInteractionTest(provider, interaction, async () => {
        return await firstValueFrom(
          authService.signup(<SignupInput>{ email: 'username3@localhost' }).pipe(
            catchError((error: HttpErrorResponse) => {
              expect(error).toBeTruthy();
              expect(error.status).toBe(interaction.willRespondWith.status);
              expect(error.error).toMatchObject(interaction.willRespondWith.body!);
              return of(void 0);
            }),
          ),
        );
      });
    });

    it('existing username error', () => {
      const interaction: V3Interaction = SignupPact.existing_username;
      return executeInteractionTest(provider, interaction, async () => {
        return await firstValueFrom(
          authService
            .signup({
              username: 'pactUser',
              email: 'username4@localhost',
            })
            .pipe(
              catchError((error: HttpErrorResponse) => {
                expect(error).toBeTruthy();
                expect(error.status).toBe(interaction.willRespondWith.status);
                expect(error.error).toMatchObject(interaction.willRespondWith.body!);
                return of(void 0);
              }),
            ),
        );
      });
    });
  });

  describe('login', () => {
    beforeEach(() => {
      halFormService.setResource({
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

    //   it('locked role', (done) => {
    //     const interaction: InteractionObject = LoginPact.locked_role;
    //     provider.addInteraction(interaction).then(() => {
    //       authService.login({ username: 'lockedRoleUser', password: 'lockedRoleUser' }).subscribe({
    //         error: (error: HttpErrorResponse) => {
    //           expect(error).toBeTruthy();
    //           expect(error.status).toBe(interaction.willRespondWith.status);
    //           expect(error.error).toMatchObject(interaction.willRespondWith.body!);
    //           done();
    //         },
    //       });
    //     });
    //   });

    //   it('locked user', (done) => {
    //     const interaction: InteractionObject = LoginPact.locked_user;
    //     provider.addInteraction(interaction).then(() => {
    //       authService.login({ username: 'lockedUser', password: 'lockedUser' }).subscribe({
    //         error: (error: HttpErrorResponse) => {
    //           expect(error).toBeTruthy();
    //           expect(error.status).toBe(interaction.willRespondWith.status);
    //           expect(error.error).toMatchObject(interaction.willRespondWith.body!);
    //           done();
    //         },
    //       });
    //     });
    //   });

    it('successful', () => {
      const interaction: V3Interaction = LoginPact.successful;
      return executeInteractionTest(provider, interaction, async () => {
        return await firstValueFrom(authService.login({ username: 'pactUser', password: 'pactUser0' }));
      });
    });
  });
  //
  // describe('refresh token', () => {
  //   beforeEach(() => {
  //     halFormService.setResource({
  //       _links: {
  //         self: {
  //           href: '/api',
  //         },
  //         [AuthRelations.TOKEN_RELATION]: {
  //           href: '/api/auth/token',
  //         },
  //       },
  //     });
  //   });
  //
  //   it.only('successful', (done) => {
  //     const interaction: InteractionObject = RefreshTokenPact.successful;
  //     provider.addInteraction(interaction).then(() => {
  //       localStorage.setItem(
  //         TokenKeys.TOKEN,
  //         jwtToken({
  //           user: { id: pactCurrentUser.id },
  //           authorities: [TokenAuthority.TOKEN_REFRESH],
  //         }),
  //       );
  //       halFormService
  //         .getLinkOrThrow(AuthRelations.TOKEN_RELATION)
  //         .pipe(switchMap((link) => link.get<IResource>()))
  //         .subscribe((response: HttpResponse<IResource>) => {
  //           expect(response).toBeTruthy();
  //           expect(response.headers.get(HttpHeaderKey.JWT_TOKEN)).toBe(
  //             (<Matcher<string>>interaction.willRespondWith.headers?.[HttpHeaderKey.JWT_TOKEN]).getValue(),
  //           );
  //           expect(response.headers.get(HttpHeaderKey.JWT_REFRESH_TOKEN)).toBe(
  //             (<Matcher<string>>interaction.willRespondWith.headers?.[HttpHeaderKey.JWT_REFRESH_TOKEN]).getValue(),
  //           );
  //           expect(response.body?.id).toBe(pactCurrentUser.id);
  //           done();
  //         });
  //     });
  //   });
  //
  //   it('locked role', (done) => {
  //     const interaction: InteractionObject = RefreshTokenPact.locked_role;
  //     provider.addInteraction(interaction).then(() => {
  //       localStorage.setItem(
  //         TokenKeys.TOKEN,
  //         jwtToken({
  //           user: { id: 'lockedRoleUserId' },
  //           authorities: [TokenAuthority.TOKEN_REFRESH],
  //         }),
  //       );
  //       halFormService
  //         .getLinkOrThrow(AuthRelations.TOKEN_RELATION)
  //         .pipe(switchMap((link) => link.get()))
  //         .subscribe({
  //           error: (error: HttpErrorResponse) => {
  //             expect(error).toBeTruthy();
  //             expect(error.status).toBe(interaction.willRespondWith.status);
  //             expect(error.error).toMatchObject(interaction.willRespondWith.body!);
  //             done();
  //           },
  //         });
  //     });
  //   });
  //
  //   it('locked user', (done) => {
  //     const interaction: InteractionObject = RefreshTokenPact.locked_user;
  //     provider.addInteraction(interaction).then(() => {
  //       localStorage.setItem(
  //         TokenKeys.TOKEN,
  //         jwtToken({
  //           user: { id: 'lockedUserId' },
  //           authorities: [TokenAuthority.TOKEN_REFRESH],
  //         }),
  //       );
  //       halFormService
  //         .getLinkOrThrow(AuthRelations.TOKEN_RELATION)
  //         .pipe(switchMap((link) => link.get()))
  //         .subscribe({
  //           error: (error: HttpErrorResponse) => {
  //             expect(error).toBeTruthy();
  //             expect(error.status).toBe(interaction.willRespondWith.status);
  //             expect(error.error).toMatchObject(interaction.willRespondWith.body!);
  //             done();
  //           },
  //         });
  //     });
  //   });
  //
  //   it('unauthorized', (done) => {
  //     const interaction: InteractionObject = RefreshTokenPact.unauthorized;
  //     provider.addInteraction(interaction).then(() => {
  //       localStorage.setItem(TokenKeys.TOKEN, jwtToken({ user: { id: pactCurrentUser.id } }));
  //       halFormService
  //         .getLinkOrThrow(AuthRelations.TOKEN_RELATION)
  //         .pipe(switchMap((link) => link.get()))
  //         .subscribe({
  //           error: (error: HttpErrorResponse) => {
  //             expect(error).toBeTruthy();
  //             expect(error.status).toBe(interaction.willRespondWith.status);
  //             expect(error.error).toMatchObject(interaction.willRespondWith.body!);
  //             done();
  //           },
  //         });
  //     });
  //   });
  //
  //   it('not found', (done) => {
  //     const interaction: InteractionObject = RefreshTokenPact.not_found;
  //     provider.addInteraction(interaction).then(() => {
  //       localStorage.setItem(
  //         TokenKeys.TOKEN,
  //         jwtToken({
  //           user: { id: 'notFoundId' },
  //           authorities: [TokenAuthority.TOKEN_REFRESH],
  //         }),
  //       );
  //       halFormService
  //         .getLinkOrThrow(AuthRelations.TOKEN_RELATION)
  //         .pipe(switchMap((link) => link.get()))
  //         .subscribe({
  //           error: (error: HttpErrorResponse) => {
  //             expect(error).toBeTruthy();
  //             expect(error.status).toBe(interaction.willRespondWith.status);
  //             expect(error.error).toMatchObject(interaction.willRespondWith.body!);
  //             done();
  //           },
  //         });
  //     });
  //   });
  // });
  //
  // describe('Activation token', () => {
  //   beforeEach(() => {
  //     halFormService.setResource({
  //       _links: {
  //         self: {
  //           href: '/api',
  //         },
  //         [ActivationTokenRelations.ACTIVATION_TOKEN_REL]: {
  //           href: '/api/auth/login',
  //         },
  //       },
  //       _templates: {
  //         default: {},
  //         [ActivationTokenRelations.REQUEST_ACTIVATION_TOKEN_REL]: {
  //           method: 'POST',
  //           properties: [
  //             {
  //               name: 'email',
  //               required: true,
  //               type: 'email',
  //             },
  //           ],
  //           target: '/api/auth/token',
  //         },
  //       },
  //     });
  //   });
  //
  //   it('email not found', (done) => {
  //     const interaction: Interaction = ActivationTokenPact.not_found;
  //     provider.addInteraction(interaction).then(() => {
  //       activationTokenService.requestActivationToken('notFound@localhost').subscribe({
  //         error: (error: HttpErrorResponse) => {
  //           expect(error).toBeTruthy();
  //           expect(error.status).toBe(404);
  //           expect(error.error).toMatchObject(interaction.json().response.body!);
  //           done();
  //         },
  //       });
  //     });
  //   });
  //
  //   it('successful', (done) => {
  //     provider.addInteraction(ActivationTokenPact.successful).then(() => {
  //       activationTokenService.requestActivationToken('lockedRoleUser@localhost').subscribe(() => done());
  //     });
  //   });
  // });
  //
  // describe('Activate account', () => {
  //   beforeEach(() => {
  //     halFormService.setResource({
  //       _links: {
  //         self: {
  //           href: '/api',
  //         },
  //         [ActivationTokenRelations.ACTIVATE_ACCOUNT_LINK]: {
  //           href: '/api/auth/activate',
  //         },
  //       },
  //       _templates: {
  //         default: {},
  //         [ActivationTokenRelations.ACTIVATE_ACCOUNT_REL]: {
  //           method: 'POST',
  //           properties: [
  //             {
  //               name: 'email',
  //               required: true,
  //               type: 'email',
  //             },
  //             {
  //               name: 'password',
  //               required: true,
  //               minLength: 8,
  //               maxLength: 128,
  //               type: 'text',
  //             },
  //             {
  //               name: 'token',
  //               required: true,
  //               minLength: 8,
  //               maxLength: 128,
  //               type: 'text',
  //             },
  //           ],
  //           target: '/api/auth/activate',
  //         },
  //       },
  //     });
  //   });
  //
  //   it('not found', (done) => {
  //     const interaction: InteractionObject = ActivateAccountPact.not_found;
  //     provider.addInteraction(interaction).then(() => {
  //       activationTokenService
  //         .activateAccount({ password: 'notFoundPassword', token: 'notFoundTokenId', email: 'notFound@localhost' })
  //         .subscribe({
  //           error: (error: HttpErrorResponse) => {
  //             expect(error).toBeTruthy();
  //             expect(error.status).toBe(404);
  //             expect(error.error).toMatchObject(interaction.willRespondWith.body!);
  //             done();
  //           },
  //         });
  //     });
  //   });
  //
  //   it('successful', (done) => {
  //     provider.addInteraction(ActivateAccountPact.successful).then(() => {
  //       activationTokenService
  //         .activateAccount({
  //           password: 'activationUser',
  //           token: 'activationUserTokenId',
  //           email: 'activationUser@localhost',
  //         })
  //         .subscribe((response) => {
  //           expect(response).toBeTruthy();
  //           done();
  //         });
  //     });
  //   });
  // });
});

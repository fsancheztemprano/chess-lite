import { HttpClient, HttpClientModule, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { GlobalSettings, TokenKeys } from '@app/ui/shared/domain';
import { HalFormClientModule, Link, Template } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { pactForResource } from '../../utils/pact.utils';
import { jwtToken } from '../../utils/token.util';
import { GetGlobalSettingPact, UpdateGlobalSettingPact } from './global-settings.pact';

const provider: Pact = pactForResource('globalSettings');

describe('Global Settings Pacts', () => {
  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HalFormClientModule],
      providers: [avengersAssemble(provider.mockService.baseUrl)],
    });
    TestBed.inject(HttpClient);
  });

  describe('Get Global Settings', () => {
    it('successful', (done) => {
      const interaction: InteractionObject = GetGlobalSettingPact.successful;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: ['global-settings:read'] }));
        Link.ofHref('/api/global-settings')
          .fetch<GlobalSettings>()
          .subscribe((response: HttpResponse<GlobalSettings>) => {
            expect(response).toBeTruthy();
            expect(response.status).toBe(interaction.willRespondWith.status);
            expect(response.body?._links).toStrictEqual(interaction.willRespondWith.body._links);
            expect(response.body?.defaultRole?.name).toEqual(interaction.willRespondWith.body.defaultRole.name);
            expect(response.body?.defaultRole?.authorities).toHaveLength(
              interaction.willRespondWith.body.defaultRole.authorities.length,
            );
            done();
          });
      });
    });

    it('with update', (done) => {
      const interaction: InteractionObject = GetGlobalSettingPact.with_update;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(
          TokenKeys.TOKEN,
          jwtToken({ authorities: ["global-settings:read', 'global-settings:update"] }),
        );
        Link.ofHref('/api/global-settings')
          .fetch<GlobalSettings>()
          .subscribe((response: HttpResponse<GlobalSettings>) => {
            expect(response).toBeTruthy();
            expect(response.status).toBe(interaction.willRespondWith.status);
            expect(response.body?._templates?.update).toStrictEqual(interaction.willRespondWith.body._templates.update);
            done();
          });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = GetGlobalSettingPact.unauthorized;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken());
        Link.ofHref('/api/global-settings')
          .fetch<GlobalSettings>()
          .subscribe({
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

  describe('Update Global Settings', () => {
    it('successful', (done) => {
      const interaction: InteractionObject = UpdateGlobalSettingPact.successful;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: ['global-settings:update'] }));
        Template.of({ method: 'PATCH', target: '/api/global-settings' })
          .afford<GlobalSettings>({ body: { signupOpen: true } })
          .subscribe((response: HttpResponse<GlobalSettings>) => {
            expect(response).toBeTruthy();
            expect(response.status).toBe(interaction.willRespondWith.status);
            expect(response.body?._links).toStrictEqual(interaction.willRespondWith.body._links);
            expect(response.body?.defaultRole?.name).toEqual(interaction.willRespondWith.body.defaultRole.name);
            expect(response.body?.defaultRole?.authorities).toHaveLength(
              interaction.willRespondWith.body.defaultRole.authorities.length,
            );
            done();
          });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = UpdateGlobalSettingPact.unauthorized;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken());
        Template.of({ method: 'PATCH', target: '/api/global-settings' })
          .afford<GlobalSettings>({ body: { signupOpen: true } })
          .subscribe({
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

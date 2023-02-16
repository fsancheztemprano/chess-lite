import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ThemeService } from '@app/ui/shared/app';
import { IThemeModel, TokenKeys } from '@app/ui/shared/domain';
import { defaultTemplate } from '@app/ui/testing';
import { HalFormClientModule, HalFormService, Resource } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { pactForResource } from '../../utils/pact.utils';
import { jwtToken } from '../../utils/token.utils';
import { GetThemePact, themeUpdateTemplate, UpdateThemePact } from './theme.pact';

const provider: Pact = pactForResource('theme');

describe('Theme Pacts', () => {
  let service: ThemeService;

  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HalFormClientModule],
      providers: [avengersAssemble(provider.mockService.baseUrl)],
    });

    TestBed.inject(HalFormService).setResource({
      _links: {
        self: {
          href: '/api',
        },
        theme: {
          href: '/api/theme',
        },
      },
      _templates: { ...defaultTemplate },
    });
    service = TestBed.inject(ThemeService);
  });

  describe('Get Theme', () => {
    it('successful', (done) => {
      const interaction: InteractionObject = GetThemePact.successful;
      provider.addInteraction(interaction).then(() => {
        service.getTheme().subscribe((theme: IThemeModel) => {
          expect(theme).toBeTruthy();
          expect(theme).toMatchObject(interaction.willRespondWith.body);
          done();
        });
      });
    });

    it('with update', (done) => {
      const interaction: InteractionObject = GetThemePact.with_update;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: ['theme:update'] }));
        service.getTheme().subscribe((theme: IThemeModel) => {
          expect(theme).toBeTruthy();
          expect(theme).toMatchObject(interaction.willRespondWith.body);
          done();
        });
      });
    });
  });

  describe('Update Theme', () => {
    const newColors = {
      primaryColor: '#3e58dc',
      accentColor: '#26881b',
      warnColor: '#6c0707',
    };
    const colorResource = {
      _links: {
        self: { href: '/api/theme' },
      },
      _templates: {
        ...defaultTemplate,
        ...themeUpdateTemplate,
      },
    };

    it('successful', (done) => {
      const interaction: InteractionObject = UpdateThemePact.successful;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken({ authorities: ['theme:update'] }));
        service.updateTheme(Resource.of(colorResource), newColors).subscribe((theme: IThemeModel) => {
          expect(theme).toBeTruthy();
          expect(theme).toMatchObject(interaction.willRespondWith.body);
          done();
        });
      });
    });

    it('unauthorized', (done) => {
      const interaction: InteractionObject = UpdateThemePact.unauthorized;
      provider.addInteraction(interaction).then(() => {
        localStorage.setItem(TokenKeys.TOKEN, jwtToken());
        service.updateTheme(Resource.of(colorResource), newColors).subscribe({
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

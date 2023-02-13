import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { IThemeModel, TokenKeys } from '@app/ui/shared/domain';
import { defaultTemplate } from '@app/ui/testing';
import { HalFormClientModule, HalFormService, Resource } from '@hal-form-client';
import { InteractionObject, Pact } from '@pact-foundation/pact';
import { ThemeService } from '../../../../ui/shared/core/src/lib/services/theme.service';
import { avengersAssemble } from '../../interceptor/pact.interceptor';
import { pactForResource } from '../../utils/pact.utils';
import { jwtToken } from '../../utils/token.utils';
import { GetThemePact, themeUpdateTemplate, UpdateThemePact } from './theme.pact';

const provider: Pact = pactForResource('themeModel');

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
          expect(theme._links).toMatchObject(interaction.willRespondWith.body._links);
          expect(theme.colors).toEqual(interaction.willRespondWith.body.colors);
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
          expect(theme._links).toMatchObject(interaction.willRespondWith.body._links);
          expect(theme._templates?.update).toMatchObject(interaction.willRespondWith.body._templates.update);
          done();
        });
      });
    });
  });

  describe('Update Theme', () => {
    const newColors = {
      primary: '#3e58dc',
      accent: '#26881b',
      warn: '#6c0707',
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
          expect(theme._links).toMatchObject(interaction.willRespondWith.body._links);
          expect(theme.colors).toEqual(interaction.willRespondWith.body.colors);
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

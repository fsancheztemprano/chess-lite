import { TestBed } from '@angular/core/testing';
import { stubThemeServiceProvider, ThemeService, updateSession } from '@app/ui/shared/app';
import { stubThemeRepositoryProvider, ThemeRepository, updateDarkMode, updateTheme } from '@app/ui/shared/core';
import { Actions, EffectsNgModule } from '@ngneat/effects-ng';
import { ThemeEffects } from './theme.effects';

describe('ThemeEffects', () => {
  let actions: Actions;

  let themeRepository: ThemeRepository;
  let themeService: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EffectsNgModule.forRoot([ThemeEffects])],
      providers: [stubThemeRepositoryProvider, stubThemeServiceProvider],
    });
    actions = TestBed.inject(Actions);
    themeRepository = TestBed.inject(ThemeRepository);
    themeService = TestBed.inject(ThemeService);
  });

  it('updateDarkMode$ should update dark mode', () => {
    const updateDarkModeSpy = jest.spyOn(themeRepository, 'updateDarkMode');
    const darkMode = true;

    expect(updateDarkModeSpy).not.toHaveBeenCalled();

    actions.dispatch(updateDarkMode({ darkMode }));

    expect(updateDarkModeSpy).toHaveBeenCalledTimes(1);
    expect(updateDarkModeSpy).toHaveBeenCalledWith(darkMode);
  });

  it('syncUserPreferencesDarkMode$ should update preferences dark mode', () => {
    const updateDarkModeSpy = jest.spyOn(themeRepository, 'updateDarkMode');
    const userPreferences = { darkMode: true };

    expect(updateDarkModeSpy).not.toHaveBeenCalled();

    actions.dispatch(updateSession({ userPreferences } as never));

    expect(updateDarkModeSpy).toHaveBeenCalledTimes(1);
    expect(updateDarkModeSpy).toHaveBeenCalledWith(userPreferences.darkMode);
  });

  it('syncUserPreferencesDarkMode$ should update user preferences dark mode', () => {
    const updateDarkModeSpy = jest.spyOn(themeRepository, 'updateDarkMode');
    const user = { userPreferences: { darkMode: true } };

    expect(updateDarkModeSpy).not.toHaveBeenCalled();

    actions.dispatch(updateSession({ user } as never));

    expect(updateDarkModeSpy).toHaveBeenCalledTimes(1);
    expect(updateDarkModeSpy).toHaveBeenCalledWith(user.userPreferences.darkMode);
  });

  it('syncUserPreferencesDarkMode$ should not update on null value', () => {
    const updateDarkModeSpy = jest.spyOn(themeRepository, 'updateDarkMode');

    actions.dispatch(updateSession(null as never));

    expect(updateDarkModeSpy).not.toHaveBeenCalled();
  });

  it('updateTheme$ should update theme', () => {
    const updateThemeSpy = jest.spyOn(themeService, 'updateAppColors');
    const theme = { primaryColor: '#00FF00' };

    expect(updateThemeSpy).not.toHaveBeenCalled();

    actions.dispatch(updateTheme(theme));

    expect(updateThemeSpy).toHaveBeenCalledTimes(1);
    expect(updateThemeSpy).toHaveBeenCalledWith({ type: '[Theme] Update Theme', ...theme });
  });
});

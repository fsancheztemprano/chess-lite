import { TestBed } from '@angular/core/testing';
import { updateSession } from '@app/ui/shared/app';
import { stubThemeRepositoryProvider, ThemeRepository, updateDarkMode } from '@app/ui/shared/core';
import { Actions, EffectsNgModule } from '@ngneat/effects-ng';
import { ThemeEffects } from './theme.effects';

describe('ThemeEffects', () => {
  let actions: Actions;

  let themeRepository: ThemeRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EffectsNgModule.forRoot([ThemeEffects])],
      providers: [stubThemeRepositoryProvider],
    });
    actions = TestBed.inject(Actions);
    themeRepository = TestBed.inject(ThemeRepository);
  });

  it('updateContentLanguage$ should update content language', () => {
    const updateContentLanguageSpy = jest.spyOn(themeRepository, 'updateDarkMode');
    const darkMode = true;

    expect(updateContentLanguageSpy).not.toHaveBeenCalled();

    actions.dispatch(updateDarkMode({ darkMode }));

    expect(updateContentLanguageSpy).toHaveBeenCalledTimes(1);
    expect(updateContentLanguageSpy).toHaveBeenCalledWith(darkMode);
  });

  it('syncUserPreferencesContentLanguage$ should update preferences content language', () => {
    const updateContentLanguageSpy = jest.spyOn(themeRepository, 'updateDarkMode');
    const userPreferences = { darkMode: true };

    expect(updateContentLanguageSpy).not.toHaveBeenCalled();

    actions.dispatch(updateSession({ userPreferences } as never));

    expect(updateContentLanguageSpy).toHaveBeenCalledTimes(1);
    expect(updateContentLanguageSpy).toHaveBeenCalledWith(userPreferences.darkMode);
  });

  it('syncUserPreferencesContentLanguage$ should update user preferences content language', () => {
    const updateContentLanguageSpy = jest.spyOn(themeRepository, 'updateDarkMode');
    const user = { userPreferences: { darkMode: true } };

    expect(updateContentLanguageSpy).not.toHaveBeenCalled();

    actions.dispatch(updateSession({ user } as never));

    expect(updateContentLanguageSpy).toHaveBeenCalledTimes(1);
    expect(updateContentLanguageSpy).toHaveBeenCalledWith(user.userPreferences.darkMode);
  });

  it('syncUserPreferencesContentLanguage$ should not update on null value', () => {
    const updateContentLanguageSpy = jest.spyOn(themeRepository, 'updateDarkMode');

    actions.dispatch(updateSession(null as never));

    expect(updateContentLanguageSpy).not.toHaveBeenCalled();
  });
});

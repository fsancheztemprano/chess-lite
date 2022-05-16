import { TestBed } from '@angular/core/testing';
import { updateSession } from '@app/ui/shared/app';
import { LocalizationRepository, stubLocalizationRepositoryProvider, updateContentLanguage } from '@app/ui/shared/core';
import { Actions, EffectsNgModule } from '@ngneat/effects-ng';
import { LocalizationEffects } from './localization.effects';

describe('LocalizationEffects', () => {
  let actions: Actions;

  let localizationRepository: LocalizationRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EffectsNgModule.forRoot([LocalizationEffects])],
      providers: [stubLocalizationRepositoryProvider],
    });
    actions = TestBed.inject(Actions);
    localizationRepository = TestBed.inject(LocalizationRepository);
  });

  it('updateContentLanguage$ should update content language', () => {
    const updateContentLanguageSpy = jest.spyOn(localizationRepository, 'updateContentLanguage');
    const contentLanguage = 'en';

    expect(updateContentLanguageSpy).not.toHaveBeenCalled();

    actions.dispatch(updateContentLanguage({ contentLanguage }));

    expect(updateContentLanguageSpy).toHaveBeenCalledTimes(1);
    expect(updateContentLanguageSpy).toHaveBeenCalledWith(contentLanguage);
  });

  it('syncUserPreferencesContentLanguage$ should update preferences content language', () => {
    const updateContentLanguageSpy = jest.spyOn(localizationRepository, 'updateContentLanguage');
    const userPreferences = { contentLanguage: 'en' };

    expect(updateContentLanguageSpy).not.toHaveBeenCalled();

    actions.dispatch(updateSession({ userPreferences } as never));

    expect(updateContentLanguageSpy).toHaveBeenCalledTimes(1);
    expect(updateContentLanguageSpy).toHaveBeenCalledWith(userPreferences.contentLanguage);
  });

  it('syncUserPreferencesContentLanguage$ should update user preferences content language', () => {
    const updateContentLanguageSpy = jest.spyOn(localizationRepository, 'updateContentLanguage');
    const user = { userPreferences: { contentLanguage: 'en' } };

    expect(updateContentLanguageSpy).not.toHaveBeenCalled();

    actions.dispatch(updateSession({ user } as never));

    expect(updateContentLanguageSpy).toHaveBeenCalledTimes(1);
    expect(updateContentLanguageSpy).toHaveBeenCalledWith(user.userPreferences.contentLanguage);
  });

  it('syncUserPreferencesContentLanguage$ should not update on null value', () => {
    const updateContentLanguageSpy = jest.spyOn(localizationRepository, 'updateContentLanguage');

    actions.dispatch(updateSession(null as never));

    expect(updateContentLanguageSpy).not.toHaveBeenCalled();
  });
});

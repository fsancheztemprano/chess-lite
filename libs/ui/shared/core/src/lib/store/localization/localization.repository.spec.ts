import { TestBed } from '@angular/core/testing';
import { getTranslocoModule } from '@app/ui/testing';
import { firstValueFrom } from 'rxjs';
import { LocalizationRepository } from './localization.repository';

describe('LocalizationRepository', () => {
  let service: LocalizationRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoModule()],
      providers: [LocalizationRepository],
    });
    service = TestBed.inject(LocalizationRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get content language', async () => {
    await expect(firstValueFrom(service.contentLanguage$)).resolves.toBe('en');
  });

  it('should set content language and update transloco', async () => {
    const translocoSpy = jest.spyOn(service['translateService'], 'setActiveLang');
    service.updateContentLanguage('fr');
    await expect(firstValueFrom(service.contentLanguage$)).resolves.toBe('fr');

    expect(translocoSpy).toHaveBeenCalledWith('fr');
  });
});

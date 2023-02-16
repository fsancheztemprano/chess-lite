import { TestBed } from '@angular/core/testing';
import { stubThemeServiceProvider } from '@app/ui/shared/app';
import { firstValueFrom } from 'rxjs';

import { ThemeResolver } from './theme.resolver';

describe('ThemeResolver', () => {
  let resolver: ThemeResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubThemeServiceProvider],
    });
    resolver = TestBed.inject(ThemeResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve theme from service', async () => {
    const getThemeSpy = jest.spyOn(resolver['themeService'], 'getTheme');
    await expect(firstValueFrom(resolver.resolve())).resolves.toBeTruthy();
    expect(getThemeSpy).toHaveBeenCalledTimes(1);
  });
});

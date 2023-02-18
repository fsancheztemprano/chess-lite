import { TestBed } from '@angular/core/testing';
import { stubSessionServiceProvider, stubThemeServiceProvider } from '@app/ui/shared/app';
import { firstValueFrom } from 'rxjs';
import { AppInitializationService } from './app-initialization.service';

describe('AppInitializationService', () => {
  let service: AppInitializationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubSessionServiceProvider, stubThemeServiceProvider],
    });
    service = TestBed.inject(AppInitializationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch initialization action', async () => {
    const initializeSessionStub = jest.spyOn(service['sessionService'], 'initialize');
    const initializeTheme = jest.spyOn(service['themeService'], 'initializeTheme');
    await firstValueFrom(service.initialize());
    expect(initializeSessionStub).toHaveBeenCalled();
    expect(initializeTheme).toHaveBeenCalled();
  });
});

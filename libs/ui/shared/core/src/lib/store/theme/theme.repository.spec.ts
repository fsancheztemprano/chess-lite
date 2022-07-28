import { TestBed } from '@angular/core/testing';
import { getTranslocoModule } from '@app/ui/testing';
import { firstValueFrom } from 'rxjs';
import { ThemeRepository } from './theme.repository';

describe('ThemeRepository', () => {
  let service: ThemeRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoModule()],
      providers: [ThemeRepository],
    });
    service = TestBed.inject(ThemeRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get dark mode', async () => {
    return expect(firstValueFrom(service.darkMode$)).resolves.toBe(false);
  });

  it('should set dark mode', async () => {
    service.updateDarkMode(true);
    return expect(firstValueFrom(service.darkMode$)).resolves.toBe(true);
  });
});

import { TestBed } from '@angular/core/testing';
import { stubSessionServiceProvider } from '@app/ui/shared/app';
import { Actions, EffectsNgModule } from '@ngneat/effects-ng';
import { SessionEffects } from '../store/session.effects';
import { AppInitializationService } from './app-initialization.service';

describe('AppInitializationService', () => {
  let service: AppInitializationService;
  let customActionsStream: Actions;

  beforeEach(() => {
    customActionsStream = new Actions();
    TestBed.configureTestingModule({
      providers: [stubSessionServiceProvider],
      imports: [EffectsNgModule.forRoot([SessionEffects], { customActionsStream })],
    });
    service = TestBed.inject(AppInitializationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should dispatch initialization action', (done) => {
    customActionsStream.subscribe((action) => {
      expect(action).toBeTruthy();
      expect(action.type).toBe('[Session] Initialize Session');
      done();
    });

    service.initialize().subscribe();
  });
});

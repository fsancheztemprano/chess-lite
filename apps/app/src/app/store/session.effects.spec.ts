import { TestBed } from '@angular/core/testing';
import {
  clearSession,
  initializeSession,
  SessionProps,
  SessionRepository,
  SessionService,
  stubSessionServiceProvider,
  updateSession,
} from '@app/ui/shared/app';
import { User, UserPreferences } from '@app/ui/shared/domain';
import { Actions, EffectsNgModule } from '@ngneat/effects-ng';
import { SessionEffects } from '../store/session.effects';

describe('AppInitializationService', () => {
  let actions: Actions;

  let sessionService: SessionService;
  let sessionRepository: SessionRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [stubSessionServiceProvider],
      imports: [EffectsNgModule.forRoot([SessionEffects])],
    });

    actions = TestBed.inject(Actions);
    sessionService = TestBed.inject(SessionService);
    sessionRepository = TestBed.inject(SessionRepository);
  });

  it('initialize$ effect should initialize session', () => {
    const initializeSpy = jest.spyOn(sessionService, 'initialize');
    const session = {};

    expect(initializeSpy).not.toHaveBeenCalled();

    actions.dispatch(initializeSession({ session }));

    expect(initializeSpy).toHaveBeenCalledTimes(1);
    expect(initializeSpy).toHaveBeenCalledWith(session);
  });

  it('clearSession$ effect should clear session', () => {
    const clearSessionSpy = jest.spyOn(sessionService, 'clearSession');

    expect(clearSessionSpy).not.toHaveBeenCalled();

    actions.dispatch(clearSession());

    expect(clearSessionSpy).toHaveBeenCalledTimes(1);
  });

  it('updateSession$ effect should updateSession session', () => {
    const updateSessionSpy = jest.spyOn(sessionRepository, 'updateSession');
    const sessionProps: SessionProps = {
      user: new User(),
      userPreferences: new UserPreferences(),
    };

    expect(updateSessionSpy).not.toHaveBeenCalled();

    actions.dispatch(updateSession(sessionProps));

    expect(updateSessionSpy).toHaveBeenCalledTimes(1);
    expect(updateSessionSpy).toHaveBeenCalledWith({
      ...sessionProps,
      type: '[Session] Update Session',
    });
  });
});

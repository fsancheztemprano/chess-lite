import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  AuthRelations,
  CurrentUserRelations,
  HttpHeaderKey,
  TokenKeys,
  USE_REFRESH_TOKEN,
  User,
  UserChangedMessageAction,
  UserPreferences,
  UserPreferencesChangedMessageAction,
  WEBSOCKET_REL,
} from '@app/ui/shared/domain';
import { ContentType, HalFormClientModule, HalFormService, Link, Resource } from '@hal-form-client';
import { Actions, EffectsNgModule } from '@ngneat/effects-ng';
import { sign } from 'jsonwebtoken';
import { EMPTY, Observable, of, Subscription, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { SessionRepository } from '../store/session/session.repository';
import { stubSessionRepositoryProvider } from '../store/session/session.repository.stub';
import { MessageService } from './message.service';
import { StubMessageService, stubMessageServiceProvider } from './message.service.stub';
import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientModule, HttpClientTestingModule, EffectsNgModule.forRoot([])],
      providers: [stubMessageServiceProvider, stubSessionRepositoryProvider],
    });
    service = TestBed.inject(SessionService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('constructor', () => {
    it('should validate token on construction', () => {
      const token = sign({}, 'secret', { expiresIn: '1m' });
      const refreshToken = sign({}, 'secret', { expiresIn: '1m' });
      localStorage.setItem(TokenKeys.TOKEN, token);
      localStorage.setItem(TokenKeys.REFRESH_TOKEN, refreshToken);

      new SessionService(
        null as unknown as MessageService,
        null as unknown as HalFormService,
        null as unknown as SessionRepository,
        null as unknown as Actions,
      );

      expect(localStorage.getItem(TokenKeys.TOKEN)).toEqual(token);
      expect(localStorage.getItem(TokenKeys.REFRESH_TOKEN)).toEqual(refreshToken);
    });

    it('should remove invalid token on construction', () => {
      const token = sign({}, 'secret', { expiresIn: '-1m' });
      const refreshToken = sign({}, 'secret', { expiresIn: '-1m' });
      localStorage.setItem(TokenKeys.TOKEN, token);
      localStorage.setItem(TokenKeys.REFRESH_TOKEN, refreshToken);

      new SessionService(
        null as unknown as MessageService,
        null as unknown as HalFormService,
        null as unknown as SessionRepository,
        null as unknown as Actions,
      );

      expect(localStorage.getItem(TokenKeys.TOKEN)).toBeNull();
      expect(localStorage.getItem(TokenKeys.REFRESH_TOKEN)).toBeNull();
    });
  });

  describe('initialize', () => {
    it('should initialize', () => {
      const user = User.of();
      const initializeSessionSpy = jest
        .spyOn(SessionService.prototype as any, '_initializeSession')
        .mockReturnValueOnce(of(user));
      const token = sign({}, 'secret', { expiresIn: '1m' });

      service.initialize({ token }).subscribe();

      expect(initializeSessionSpy).toHaveBeenCalledWith(expect.objectContaining({ token }));

      initializeSessionSpy.mockRestore();
    });

    it('should get token from local storage if not provided', () => {
      const user = User.of();
      const initializeSessionSpy = jest
        .spyOn(SessionService.prototype as any, '_initializeSession')
        .mockReturnValueOnce(of(user));
      const token = sign({}, 'secret', { expiresIn: '1m' });
      localStorage.setItem(TokenKeys.TOKEN, token);

      service.initialize().subscribe();

      expect(initializeSessionSpy).toHaveBeenCalledWith(expect.objectContaining({ token }));

      initializeSessionSpy.mockRestore();
    });

    it('should reanimate session', () => {
      const resource = Resource.of();
      const reanimateSessionSpy = jest
        .spyOn(SessionService.prototype as any, '_reanimateSession')
        .mockReturnValueOnce(of(resource));
      const token = sign({}, 'secret', { expiresIn: '-1m' });
      const refreshToken = sign({}, 'secret', { expiresIn: '1m' });

      service.initialize({ token, refreshToken }).subscribe();

      expect(reanimateSessionSpy).toHaveBeenCalledTimes(1);

      reanimateSessionSpy.mockRestore();
    });

    it('should get refresh token from local storage if not provided', () => {
      const resource = Resource.of();
      const reanimateSessionSpy = jest
        .spyOn(SessionService.prototype as any, '_reanimateSession')
        .mockReturnValueOnce(of(resource));
      const token = sign({}, 'secret', { expiresIn: '-1m' });
      localStorage.setItem(TokenKeys.TOKEN, token);
      const refreshToken = sign({}, 'secret', { expiresIn: '1m' });
      localStorage.setItem(TokenKeys.REFRESH_TOKEN, refreshToken);

      expect(reanimateSessionSpy).not.toHaveBeenCalledTimes(1);

      service.initialize().subscribe();

      expect(reanimateSessionSpy).toHaveBeenCalledTimes(1);

      reanimateSessionSpy.mockRestore();
    });

    it('should initialize root if tokens are invalid', (done) => {
      const initializeRootSpy = jest
        .spyOn(SessionService.prototype as any, '_initializeRoot')
        .mockReturnValueOnce(of(Resource.of()));
      const token = sign({}, 'secret', { expiresIn: '-1m' });
      const refreshToken = sign({}, 'secret', { expiresIn: '-1m' });

      service.initialize({ token, refreshToken }).subscribe(() => {
        expect(initializeRootSpy).toHaveBeenCalledTimes(1);
        initializeRootSpy.mockRestore();
        done();
      });
    });
  });

  describe('clearSession', () => {
    it('should remove token', (done) => {
      const mockInitialization = {};
      service['userPreferencesUpdates'] = { unsubscribe: jest.fn() } as unknown as Subscription;
      service['userUpdates'] = { unsubscribe: jest.fn() } as unknown as Subscription;
      service['tokenWatchdog'] = { unsubscribe: jest.fn() } as unknown as Subscription;
      const initializeRootSpy = jest
        .spyOn(SessionService.prototype as any, '_initializeRoot')
        .mockReturnValueOnce(of(mockInitialization));
      const actionSpy = jest.spyOn(service['actions'], 'dispatch');
      const token = sign({}, 'secret', { expiresIn: '1m' });
      const refreshToken = sign({}, 'secret', { expiresIn: '1m' });
      localStorage.setItem(TokenKeys.TOKEN, token);
      localStorage.setItem(TokenKeys.REFRESH_TOKEN, refreshToken);

      service.clearSession().subscribe((value) => {
        expect(value).toBe(mockInitialization);
        expect(localStorage.getItem(TokenKeys.TOKEN)).toBeNull();
        expect(localStorage.getItem(TokenKeys.REFRESH_TOKEN)).toBeNull();
        expect(actionSpy).toHaveBeenCalledWith({ type: '[Session] Update Session' });
        expect(service['userPreferencesUpdates']?.unsubscribe).toHaveBeenCalled();
        expect(service['userUpdates']?.unsubscribe).toHaveBeenCalled();
        expect(service['tokenWatchdog']?.unsubscribe).toHaveBeenCalled();
        initializeRootSpy.mockRestore();
        done();
      });
    });
  });

  describe('_initializeSession', () => {
    it('should initialize session', (done) => {
      const resource = Resource.of();
      const initializeRootSpy = jest
        .spyOn(SessionService.prototype as any, '_initializeRoot')
        .mockReturnValueOnce(of(resource));
      const actionSpy = jest.spyOn(service['actions'], 'dispatch');
      const token = sign({}, 'secret', { expiresIn: '1m' });
      const refreshToken = sign({}, 'secret', { expiresIn: '1m' });
      const subscribeToUserChangesSpy = jest.spyOn(SessionService.prototype as any, '_subscribeToUserChanges');
      const subscribeToUserPreferencesChangesSpy = jest.spyOn(
        SessionService.prototype as any,
        '_subscribeToUserPreferencesChanges',
      );
      const tokenWatchdogSpy = jest.spyOn(SessionService.prototype as any, '_tokenWatchdog');

      service['_initializeSession']({ user: User.of(), token, refreshToken }).subscribe((value) => {
        expect(value).toStrictEqual(resource);
        expect(localStorage.getItem(TokenKeys.TOKEN)).toEqual(token);
        expect(localStorage.getItem(TokenKeys.REFRESH_TOKEN)).toEqual(refreshToken);
        expect(actionSpy).toHaveBeenCalledWith({ type: '[Session] Update Session', user: resource });
        expect(initializeRootSpy).toHaveBeenCalledTimes(1);
        expect(subscribeToUserChangesSpy).toHaveBeenCalledTimes(1);
        expect(subscribeToUserPreferencesChangesSpy).toHaveBeenCalledTimes(1);
        expect(tokenWatchdogSpy).toHaveBeenCalledTimes(1);
        initializeRootSpy.mockRestore();
        subscribeToUserChangesSpy.mockRestore();
        subscribeToUserPreferencesChangesSpy.mockRestore();
        tokenWatchdogSpy.mockRestore();

        done();
      });
    });

    it('should fetch user if not provided', (done) => {
      const resource = Resource.of();
      const token = sign({}, 'secret', { expiresIn: '1m' });
      const refreshToken = sign({}, 'secret', { expiresIn: '1m' });
      const fetchUserSpy = jest.spyOn(SessionService.prototype as any, '_fetchUser').mockReturnValueOnce(of(resource));
      const initializeRootSpy = jest
        .spyOn(SessionService.prototype as any, '_initializeRoot')
        .mockReturnValueOnce(of(resource));

      service['_initializeSession']({ token, refreshToken }).subscribe((value) => {
        expect(value).toStrictEqual(resource);
        expect(initializeRootSpy).toHaveBeenCalledTimes(1);
        expect(fetchUserSpy).toHaveBeenCalledTimes(1);
        initializeRootSpy.mockRestore();
        fetchUserSpy.mockRestore();
        done();
      });
    });

    it('should clear session on error', (done) => {
      const initializeRootSpy = jest
        .spyOn(SessionService.prototype as any, '_initializeRoot')
        .mockReturnValueOnce(throwError(() => new Error('error')));
      const clearSessionSpy = jest.spyOn(service, 'clearSession').mockReturnValueOnce(of(Resource.of()));

      const token = sign({}, 'secret', { expiresIn: '1m' });
      const refreshToken = sign({}, 'secret', { expiresIn: '1m' });
      service['_initializeSession']({ token, refreshToken }).subscribe({
        complete: () => {
          expect(clearSessionSpy).toHaveBeenCalledTimes(1);
          expect(initializeRootSpy).toHaveBeenCalledTimes(1);
          done();
        },
      });
      initializeRootSpy.mockRestore();
      clearSessionSpy.mockRestore();
    });
  });

  describe('_initializeRoot', () => {
    it('should initialize root', (done) => {
      const resource = Resource.of();
      const halInitializeSpy = jest.spyOn(service['halFormService'], 'initialize').mockReturnValueOnce(of(resource));
      jest.spyOn(service['messageService'], 'connect');

      service['_initializeRoot']().subscribe((value) => {
        expect(value).toEqual(resource);
        expect(halInitializeSpy).toHaveBeenCalled();
        expect(service['messageService'].connect).toHaveBeenCalled();
        done();
      });
    });

    it('on error should add service watchdog to retry initialization', fakeAsync(() => {
      const currentWatchdog = { unsubscribe: jest.fn() } as unknown as Subscription;
      service['serviceWatchdog'] = currentWatchdog;
      const resource = Resource.of();

      jest
        .spyOn(service['halFormService'], 'initialize')
        .mockReturnValue(throwError(() => new Error('Hal Forms Error')));
      const initializeSpy = jest.spyOn(service, 'initialize').mockReturnValueOnce(of(resource));

      service['_initializeRoot']()
        .pipe(switchMap(() => service['serviceWatchdog'] as unknown as Observable<unknown>))
        .subscribe((value) => expect(value).toEqual(resource));

      tick(1000);
      expect(currentWatchdog.unsubscribe).toHaveBeenCalled();
      expect(initializeSpy).not.toHaveBeenCalled();

      tick(7000);
      expect(initializeSpy).toHaveBeenCalled();
    }));
  });

  describe('_refreshToken', () => {
    it('should request fetch token link with refresh token and initialize', (done) => {
      const initializeSpy = jest.spyOn(service, 'initialize').mockReturnValueOnce(EMPTY);
      const clearSessionSpy = jest.spyOn(service, 'clearSession').mockReturnValueOnce(EMPTY);
      const user = new User();
      const token = sign({}, 'secret', { expiresIn: '5m' });
      const refreshToken = sign({}, 'secret', { expiresIn: '1h' });

      service['_refreshToken'](
        Resource.of({
          _links: {
            self: { href: '/api/root' },
            [AuthRelations.TOKEN_RELATION]: { href: '/api/token' },
          },
        }),
      ).subscribe({
        complete: () => {
          expect(initializeSpy).toHaveBeenCalledTimes(1);
          expect(initializeSpy).toHaveBeenCalledWith({
            user,
            token,
            refreshToken,
          });
          expect(clearSessionSpy).not.toHaveBeenCalled();
          done();
        },
      });

      httpTestingController.expectOne('/api/token').flush(user, {
        headers: {
          [HttpHeaderKey.CONTENT_TYPE]: [ContentType.APPLICATION_JSON_HAL_FORMS],
          [HttpHeaderKey.JWT_TOKEN]: token,
          [HttpHeaderKey.JWT_REFRESH_TOKEN]: refreshToken,
        },
      });
    });

    it('should clear session on error', (done) => {
      const initializeSpy = jest.spyOn(service, 'initialize').mockReturnValueOnce(EMPTY);
      const clearSessionSpy = jest.spyOn(service, 'clearSession').mockReturnValueOnce(EMPTY);

      service['_refreshToken'](
        Resource.of({
          _links: {
            self: { href: '/api/root' },
            [AuthRelations.TOKEN_RELATION]: { href: '/api/token' },
          },
        }),
      ).subscribe({
        complete: () => {
          expect(initializeSpy).not.toHaveBeenCalled();
          expect(clearSessionSpy).toHaveBeenCalledTimes(1);
          done();
        },
      });

      httpTestingController.expectOne('/api/token').flush(null, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('_reanimateSession', () => {
    it('should fetch root resource with refresh token and fetch valid token', fakeAsync(() => {
      const resource = Resource.of();
      const fetchRootResourceSpy = jest
        .spyOn(service['halFormService'], 'fetchRootResource')
        .mockReturnValueOnce(of(resource));
      const refreshTokenSpy = jest.spyOn(SessionService.prototype as any, '_refreshToken').mockReturnValueOnce(EMPTY);

      service['_reanimateSession']().subscribe();

      expect(fetchRootResourceSpy).toHaveBeenCalledTimes(1);
      expect(fetchRootResourceSpy.mock.calls[0]![0]!.context?.get(USE_REFRESH_TOKEN)).toBeTrue();
      expect(refreshTokenSpy).toHaveBeenCalledTimes(1);
      expect(refreshTokenSpy).toHaveBeenCalledWith(resource);
      refreshTokenSpy.mockRestore();
    }));
  });

  describe('_tokenWatchdog', () => {
    describe('creation', () => {
      it('should not create watchdog if root resource is missing token link', () => {
        const token = sign({}, 'secret', { expiresIn: '1m' });
        localStorage.setItem(TokenKeys.TOKEN, token);
        const refreshToken = sign({}, 'secret', { expiresIn: '1m' });
        localStorage.setItem(TokenKeys.REFRESH_TOKEN, refreshToken);

        jest.spyOn(service['halFormService'], 'resource', 'get').mockReturnValueOnce(
          Resource.of({
            _links: {
              self: { href: '/api/v1/root' },
            },
          }),
        );

        service['_tokenWatchdog']();

        expect(service['tokenWatchdog']).toBeUndefined();
      });

      it('should not create watchdog token is expired', () => {
        const token = sign({}, 'secret', { expiresIn: '-1m' });
        localStorage.setItem(TokenKeys.TOKEN, token);
        const refreshToken = sign({}, 'secret', { expiresIn: '1m' });
        localStorage.setItem(TokenKeys.REFRESH_TOKEN, refreshToken);

        jest.spyOn(service['halFormService'], 'resource', 'get').mockReturnValueOnce(
          Resource.of({
            _links: {
              self: { href: '/api/v1/root' },
              [AuthRelations.TOKEN_RELATION]: { href: '/api/v1/token' },
            },
          }),
        );

        service['_tokenWatchdog']();

        expect(service['tokenWatchdog']).toBeUndefined();
      });

      it('should not create watchdog refresh token is expired', () => {
        const token = sign({}, 'secret', { expiresIn: '1m' });
        localStorage.setItem(TokenKeys.TOKEN, token);
        const refreshToken = sign({}, 'secret', { expiresIn: '-1m' });
        localStorage.setItem(TokenKeys.REFRESH_TOKEN, refreshToken);

        jest.spyOn(service['halFormService'], 'resource', 'get').mockReturnValueOnce(
          Resource.of({
            _links: {
              self: { href: '/api/v1/root' },
              [AuthRelations.TOKEN_RELATION]: { href: '/api/v1/token' },
            },
          }),
        );

        service['_tokenWatchdog']();

        expect(service['tokenWatchdog']).toBeUndefined();
      });

      it('should create watchdog if root resource has token link', () => {
        const token = sign({}, 'secret', { expiresIn: '1m' });
        localStorage.setItem(TokenKeys.TOKEN, token);
        const refreshToken = sign({}, 'secret', { expiresIn: '1m' });
        localStorage.setItem(TokenKeys.REFRESH_TOKEN, refreshToken);

        jest.spyOn(service['halFormService'], 'resource', 'get').mockReturnValueOnce(
          Resource.of({
            _links: {
              self: { href: '/api/v1/root' },
              [AuthRelations.TOKEN_RELATION]: { href: '/api/v1/token' },
            },
          }),
        );

        service['_tokenWatchdog']();

        expect(service['tokenWatchdog']).toBeTruthy();
      });
    });

    describe('scheduler', () => {
      it('should schedule not sooner than 2 secs if threshold is past', fakeAsync(() => {
        const refreshTokenSpy = jest.spyOn(SessionService.prototype as any, '_refreshToken').mockReturnValueOnce(EMPTY);
        const token = sign({}, 'secret', { expiresIn: '1s' });
        localStorage.setItem(TokenKeys.TOKEN, token);
        const refreshToken = sign({}, 'secret', { expiresIn: '1m' });
        localStorage.setItem(TokenKeys.REFRESH_TOKEN, refreshToken);

        jest.spyOn(service['halFormService'], 'resource', 'get').mockReturnValueOnce(
          Resource.of({
            _links: {
              self: { href: '/api/v1/root' },
              [AuthRelations.TOKEN_RELATION]: { href: '/api/v1/token' },
            },
          }),
        );

        service['_tokenWatchdog']();

        tick(1000);

        expect(refreshTokenSpy).not.toHaveBeenCalled();

        tick(1000);

        expect(refreshTokenSpy).toHaveBeenCalled();
        refreshTokenSpy.mockRestore();
      }));

      it('should schedule refresh at 10 percent of the token lifetime', fakeAsync(() => {
        const refreshTokenSpy = jest.spyOn(SessionService.prototype as any, '_refreshToken').mockReturnValueOnce(EMPTY);
        const token = sign({}, 'secret', { expiresIn: '1m' });
        localStorage.setItem(TokenKeys.TOKEN, token);
        const refreshToken = sign({}, 'secret', { expiresIn: '1m' });
        localStorage.setItem(TokenKeys.REFRESH_TOKEN, refreshToken);

        jest.spyOn(service['halFormService'], 'resource', 'get').mockReturnValueOnce(
          Resource.of({
            _links: {
              self: { href: '/api/v1/root' },
              [AuthRelations.TOKEN_RELATION]: { href: '/api/v1/token' },
            },
          }),
        );

        service['_tokenWatchdog']();

        tick(53000);

        expect(refreshTokenSpy).not.toHaveBeenCalled();

        tick(1000);

        expect(refreshTokenSpy).toHaveBeenCalled();
        refreshTokenSpy.mockRestore();
      }));
    });
  });

  describe('_fetchUser', () => {
    it('should fetch user', (done) => {
      const user = User.of();
      jest.spyOn(service['halFormService'], 'getLinkOrThrow').mockReturnValueOnce(of(Link.of({ href: '/api/user/1' })));

      const actionSpy = jest.spyOn(service['actions'], 'dispatch');

      service['_fetchUser']().subscribe(() => {
        expect(service['halFormService'].getLinkOrThrow).toHaveBeenCalledWith(CurrentUserRelations.CURRENT_USER_REL);
        expect(actionSpy).toHaveBeenCalledWith({
          type: '[Session] Update Session',
          user,
        });
        done();
      });

      httpTestingController.expectOne('/api/user/1').flush(user);
    });
  });

  describe('_fetchUserPreferences', () => {
    it('should fetch user preferences', (done) => {
      service['sessionRepository']['_updateUser'](
        User.of({
          _links: {
            self: { href: '/api/user-profile' },
            [CurrentUserRelations.USER_PREFERENCES_REL]: { href: '/api/user-preferences/1' },
          },
        }),
      );
      const userPreferences = UserPreferences.of();

      const actionSpy = jest.spyOn(service['actions'], 'dispatch');

      service['_fetchUserPreferences']().subscribe(() => {
        expect(actionSpy).toHaveBeenCalledWith({
          type: '[Session] Update Session',
          userPreferences,
        });
        done();
      });

      httpTestingController.expectOne('/api/user-preferences/1').flush(userPreferences);
    });
  });

  describe('_subscribeToUserChanges', () => {
    let messageService: StubMessageService;

    beforeEach(() => {
      messageService = TestBed.inject(MessageService) as unknown as StubMessageService;
    });

    it('should not create subscription if user has no websocket link', () => {
      service['_subscribeToUserChanges'](User.of());

      expect(service['userUpdates']).toBeUndefined();
    });

    it('should subscribe to user changes', () => {
      const user = User.of({
        _links: {
          self: { href: '/api/user/1' },
          [WEBSOCKET_REL]: { href: '/ami/user/u1' },
        },
      });

      const updatedUser = User.of();
      const fetchUserSpy = jest
        .spyOn(SessionService.prototype as any, '_fetchUser')
        .mockReturnValueOnce(of(updatedUser));
      const clearSessionSpy = jest.spyOn(service, 'clearSession').mockReturnValueOnce(of(Resource.of()));

      service['_subscribeToUserChanges'](user);

      expect(service['userUpdates']).toBeTruthy();

      expect(fetchUserSpy).not.toHaveBeenCalled();

      messageService.userChangedMessageSubject.next({
        userId: 'u1',
        username: 'u1',
        action: UserChangedMessageAction.UPDATED,
      });

      expect(fetchUserSpy).toHaveBeenCalledTimes(1);
      expect(clearSessionSpy).not.toHaveBeenCalled();
      fetchUserSpy.mockRestore();
      clearSessionSpy.mockRestore();
    });

    it('should clear session on user deleted message received', () => {
      const user = User.of({
        _links: {
          self: { href: '/api/user/1' },
          [WEBSOCKET_REL]: { href: '/ami/user/u1' },
        },
      });

      const updatedUser = User.of();
      const fetchUserSpy = jest
        .spyOn(SessionService.prototype as any, '_fetchUser')
        .mockReturnValueOnce(of(updatedUser));
      const clearSessionSpy = jest.spyOn(service, 'clearSession').mockReturnValueOnce(of(Resource.of()));

      service['_subscribeToUserChanges'](user);

      expect(service['userUpdates']).toBeTruthy();

      expect(clearSessionSpy).not.toHaveBeenCalled();

      messageService.userChangedMessageSubject.next({
        userId: 'u1',
        username: 'u1',
        action: UserChangedMessageAction.DELETED,
      });

      expect(fetchUserSpy).not.toHaveBeenCalled();
      expect(clearSessionSpy).toHaveBeenCalledTimes(1);
      fetchUserSpy.mockRestore();
      clearSessionSpy.mockRestore();
    });
  });

  describe('_subscribeToUserPreferencesChanges', () => {
    let messageService: StubMessageService;

    beforeEach(() => {
      messageService = TestBed.inject(MessageService) as unknown as StubMessageService;
    });

    it('should not create subscription if user preferences has no websocket link', () => {
      service['_subscribeToUserPreferencesChanges'](UserPreferences.of());

      expect(service['userPreferencesUpdates']).toBeUndefined();
    });

    it('should subscribe to user preferences changes', () => {
      const userPreferences = UserPreferences.of({
        _links: {
          self: { href: '/api/user-preferences/1' },
          [WEBSOCKET_REL]: { href: '/ami/user-preferences/up1' },
        },
      });

      const updatedUserPreferences = UserPreferences.of();
      const fetchUserPreferencesSpy = jest
        .spyOn(SessionService.prototype as any, '_fetchUserPreferences')
        .mockReturnValueOnce(of(updatedUserPreferences));

      service['_subscribeToUserPreferencesChanges'](userPreferences);

      expect(service['userPreferencesUpdates']).toBeTruthy();

      expect(fetchUserPreferencesSpy).not.toHaveBeenCalled();

      messageService.userPreferencesChangedMessageSubject.next({
        userPreferencesId: 'up1',
        action: UserPreferencesChangedMessageAction.UPDATED,
      });

      expect(fetchUserPreferencesSpy).toHaveBeenCalledTimes(1);
      fetchUserPreferencesSpy.mockRestore();
    });
  });

  describe('_validateToken', () => {
    it('should return token if valid', () => {
      const token = sign({}, 'secret', { expiresIn: '1m' });
      localStorage.setItem(TokenKeys.TOKEN, token);
      expect(service['_validateToken'](TokenKeys.TOKEN)).toEqual(token);
      expect(localStorage.getItem(TokenKeys.TOKEN)).toEqual(token);

      const refreshToken = sign({}, 'secret', { expiresIn: '1m' });
      localStorage.setItem(TokenKeys.REFRESH_TOKEN, refreshToken);
      expect(service['_validateToken'](TokenKeys.REFRESH_TOKEN)).toEqual(refreshToken);
      expect(localStorage.getItem(TokenKeys.REFRESH_TOKEN)).toEqual(refreshToken);
    });

    it('should remove invalid token and return null', () => {
      const token = sign({}, 'secret', { expiresIn: '-1m' });
      localStorage.setItem(TokenKeys.TOKEN, token);
      expect(service['_validateToken'](TokenKeys.TOKEN)).toBeNull();
      expect(localStorage.getItem(TokenKeys.TOKEN)).toBeNull();

      const refreshToken = sign({}, 'secret', { expiresIn: '-1m' });
      localStorage.setItem(TokenKeys.REFRESH_TOKEN, refreshToken);
      expect(service['_validateToken'](TokenKeys.REFRESH_TOKEN)).toBeNull();
      expect(localStorage.getItem(TokenKeys.REFRESH_TOKEN)).toBeNull();
    });
  });
});

import { TestBed } from '@angular/core/testing';
import { User, UserPreferences } from '@app/ui/shared/domain';
import { SessionRepository } from './session.repository';

describe('SessionRepository', () => {
  let service: SessionRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionRepository],
    });
    service = TestBed.inject(SessionRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update session user', (done) => {
    const newUser = new User({ id: '1' });
    service.updateSession({ user: newUser });

    service.user$.subscribe((user) => {
      expect(user).toEqual(user);
      done();
    });
  });

  it('should update session user preferences', (done) => {
    const newUserPreferences = new UserPreferences({ theme: 'dark' });
    service.updateSession({ userPreferences: newUserPreferences });

    service.userPreferences$.subscribe((userPreferences) => {
      expect(userPreferences).toEqual(userPreferences);
      done();
    });
  });
});

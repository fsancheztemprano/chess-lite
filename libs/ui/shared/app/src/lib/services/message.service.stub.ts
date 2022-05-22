import { ApplicationMessage, UserChangedMessage, UserPreferencesChangedMessage } from '@app/ui/shared/domain';
import { EMPTY, noop, Observable, of, Subject } from 'rxjs';
import { MessageService } from './message.service';

export class StubMessageService implements Partial<MessageService> {
  connect = noop;
  public userChangedMessageSubject = new Subject<UserChangedMessage>();
  public userPreferencesChangedMessageSubject = new Subject<UserPreferencesChangedMessage>();
  public userListChangedMessageSubject = new Subject<UserChangedMessage>();
  disconnect = () => of(void 0);

  multicast<T extends ApplicationMessage>(destination: string): Observable<T> {
    return this.handleDestination(destination) as Observable<T>;
  }

  handleDestination(destination: string): Observable<ApplicationMessage> {
    switch (destination) {
      case `/ami/user`:
        return this.userListChangedMessageSubject.asObservable();
      case `/ami/user/u1`:
        return this.userChangedMessageSubject.asObservable();
      case `/ami/user-preferences/up1`:
        return this.userPreferencesChangedMessageSubject.asObservable();
      default:
        return EMPTY;
    }
  }
}

export const stubMessageServiceProvider = {
  provide: MessageService,
  useClass: StubMessageService,
};

import { ApplicationMessage, MessageDestination, UserChangedMessage } from '@app/domain';
import { RxStompService } from '@stomp/ng2-stompjs';
import { EMPTY, noop, Observable, Subject } from 'rxjs';
import { MessageService } from './message.service';

export class StubMessageService implements Partial<MessageService> {
  disconnect = noop;
  public userChangedMessageSubject = new Subject<UserChangedMessage>();
  public userListChangedMessageSubject = new Subject<UserChangedMessage>();

  subscribeToMessages<T extends ApplicationMessage>(destination: string | MessageDestination): Observable<T> {
    return this.handleDestination(destination) as Observable<T>;
  }

  handleDestination(destination: string | MessageDestination): Observable<ApplicationMessage> {
    const messageDestination = MessageService.getDestinationString(destination);
    switch (messageDestination) {
      case `/ami/user`:
        return this.userListChangedMessageSubject.asObservable();
      case `/ami/user/u1`:
        return this.userListChangedMessageSubject.asObservable();
      default:
        return EMPTY;
    }
  }
}

export const stubMessageServiceProvider = {
  provide: MessageService,
  useClass: StubMessageService,
};

export class StubRxStompService implements Partial<RxStompService> {}

export const stubRxStompServiceProvider = {
  provide: RxStompService,
  useClass: StubRxStompService,
};

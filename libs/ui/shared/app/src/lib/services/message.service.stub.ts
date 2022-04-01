import { ApplicationMessage, MessageDestination, UserChangedMessage } from '@app/domain';
import { RxStompService } from '@stomp/ng2-stompjs';
import { EMPTY, Observable, of, Subject } from 'rxjs';
import { MessageService } from './message.service';

export class StubMessageService implements Partial<MessageService> {
  public userChangedMessageSubject = new Subject<UserChangedMessage>();
  public userListChangedMessageSubject = new Subject<UserChangedMessage>();
  disconnect = () => of(void 0);

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

export class StubRxStompService implements Partial<RxStompService> {
  configure = () => void 0;
}

export const stubRxStompServiceProvider = {
  provide: RxStompService,
  useClass: StubRxStompService,
};

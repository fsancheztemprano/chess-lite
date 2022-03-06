import { Injectable } from '@angular/core';
import { ApplicationMessage, MessageDestination } from '@app/domain';
import { InjectableRxStompConfig, RxStompService } from '@stomp/ng2-stompjs';
import { IMessage } from '@stomp/stompjs';
import { filter, from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as SockJS from 'sockjs-client';
import { filterNulls } from '../../shared/utils/forms/rxjs/filter-null.rxjs.pipe';

enum RxStompState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private readonly RX_STOMP_CONFIG: InjectableRxStompConfig = {
    webSocketFactory: () => {
      return new SockJS(`/websocket`);
    },
    // Headers,
    // connectHeaders: {
    //   Authorization: 'Bearer ' + localStorage.getItem('token'),
    // },
    // disconnectHeaders: {
    //   Authorization: 'Bearer ' + localStorage.getItem('token'),
    // },
    connectionTimeout: 10000,
    // How often to heartbeat?
    // Interval in milliseconds, set to 0 to disable
    heartbeatIncoming: 0, // Typical value 0 - disabled
    heartbeatOutgoing: 20000, // Typical value 20000 - every 20 seconds

    // Wait in milliseconds before attempting auto reconnect
    // Set to 0 to disable
    // Typical value 500 (500 milli seconds)
    reconnectDelay: 3000,

    // Will log diagnostics on console
    // It can be quite verbose, not recommended in production
    // Skip this key to stop logging to console
    // debug: (msg: string): void => {
    // },
  };

  public static getDestinationString(destination: string | MessageDestination): string {
    return (destination as MessageDestination)?.getDestination
      ? (destination as MessageDestination)?.getDestination()
      : (destination as string);
  }

  constructor(private readonly rxStompService: RxStompService) {}

  subscribeToMessages<T extends ApplicationMessage>(destination: string | MessageDestination): Observable<T> {
    return this._subscribeToDestination(destination).pipe(
      filter((message) => !!message?.body),
      map((message) => JSON.parse(message.body)),
      filterNulls(),
    );
  }

  private _subscribeToDestination(destination: string | MessageDestination): Observable<IMessage> {
    return this.rxStompService.watch(MessageService.getDestinationString(destination));
  }

  public connect() {
    this._setAuthenticationHeaders();
    this.rxStompService.configure(this.RX_STOMP_CONFIG);
    this.rxStompService.activate();
  }

  public disconnect() {
    from(this.rxStompService.deactivate()).subscribe(() => this._removeAuthenticationHeaders());
  }

  public connected$(): Observable<RxStompState> {
    return this.rxStompService.connected$;
  }

  private _removeAuthenticationHeaders() {
    delete this.RX_STOMP_CONFIG.connectHeaders;
    delete this.RX_STOMP_CONFIG.disconnectHeaders;
  }

  private _setAuthenticationHeaders() {
    this.RX_STOMP_CONFIG.connectHeaders = { Authorization: 'Bearer ' + localStorage.getItem('token') };
    this.RX_STOMP_CONFIG.disconnectHeaders = { Authorization: 'Bearer ' + localStorage.getItem('token') };
  }
}

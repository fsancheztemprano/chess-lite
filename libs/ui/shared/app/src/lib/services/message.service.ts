import { Injectable } from '@angular/core';
import { ApplicationMessage, MessageDestination, TOKEN_KEY } from '@app/ui/shared/domain';
import { RxStomp } from '@stomp/rx-stomp';
import { RxStompConfig } from '@stomp/rx-stomp/esm6/rx-stomp-config';
import { IMessage } from '@stomp/stompjs';
import { filter, from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as SockJS from 'sockjs-client';
import { filterNulls } from '../utils/filter-null.rxjs.pipe';

@Injectable({
  providedIn: 'root',
})
export class MessageService extends RxStomp {
  private readonly RX_STOMP_CONFIG: RxStompConfig = {
    webSocketFactory: () => {
      return new SockJS(`/websocket`);
    },
    connectionTimeout: 10000,
    heartbeatIncoming: 0,
    heartbeatOutgoing: 20000,
    reconnectDelay: 3000, // Wait in milliseconds before attempting auto reconnect
  };

  public static getDestinationString(destination: string | MessageDestination): string {
    return (destination as MessageDestination)?.getDestination
      ? (destination as MessageDestination)?.getDestination()
      : (destination as string);
  }

  constructor() {
    super();
    this.configure(this.RX_STOMP_CONFIG);
  }

  subscribeToMessages<T extends ApplicationMessage>(destination: string | MessageDestination): Observable<T> {
    return this._subscribeToDestination(destination).pipe(
      filter((message) => !!message?.body),
      map((message) => JSON.parse(message.body)),
      filterNulls(),
    );
  }

  private _subscribeToDestination(destination: string | MessageDestination): Observable<IMessage> {
    return this.watch(MessageService.getDestinationString(destination));
  }

  public connect(): void {
    this._setAuthenticationHeaders();
    this.activate();
  }

  public disconnect(): Observable<void> {
    if (this.active) {
      this._setAuthenticationHeaders();
      return from(this.deactivate());
    }
    return of(void 0);
  }

  private _setAuthenticationHeaders() {
    const token = localStorage.getItem(TOKEN_KEY);
    this.configure({
      connectHeaders: token ? { Authorization: 'Bearer ' + token } : undefined,
      disconnectHeaders: token ? { Authorization: 'Bearer ' + token } : undefined,
    });
  }
}

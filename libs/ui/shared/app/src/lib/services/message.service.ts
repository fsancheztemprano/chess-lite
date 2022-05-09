import { Injectable } from '@angular/core';
import { ApplicationMessage, HotSocket, TokenKeys } from '@app/ui/shared/domain';
import { RxStomp } from '@stomp/rx-stomp';
import { RxStompConfig } from '@stomp/rx-stomp/esm6/rx-stomp-config';
import { filter, from, Observable, of, share } from 'rxjs';
import { map } from 'rxjs/operators';
import { filterNulls } from '../utils/filter-null.rxjs.pipe';

const prepareBrokerURL = (path: string): string => {
  const url = new URL(path, window.location.href);
  url.protocol = url.protocol.replace('http', 'ws');
  return url.href;
};

@Injectable({ providedIn: 'root' })
export class MessageService extends RxStomp {
  private readonly RX_STOMP_CONFIG: RxStompConfig = {
    brokerURL: prepareBrokerURL('/websocket'),
    connectionTimeout: 10000,
    heartbeatIncoming: 0,
    heartbeatOutgoing: 20000,
    reconnectDelay: 1000, // Wait in milliseconds before attempting auto reconnect
  };
  private multicasts: Map<string, Observable<ApplicationMessage>> = new Map<string, Observable<ApplicationMessage>>();

  constructor() {
    super();
    this.configure(this.RX_STOMP_CONFIG);
  }

  public connect(): void {
    this._setAuthenticationHeaders();
    this.activate();
  }

  public multicast<T extends ApplicationMessage = ApplicationMessage>(destination: string): Observable<T> {
    if (!this.multicasts.has(destination)) {
      this.multicasts.set(
        destination,
        this.watch(destination).pipe(
          share(),
          filter((message) => !!message?.body),
          map((message) => JSON.parse(message.body)),
          filterNulls(),
        ),
      );
    }
    return this.multicasts.get(destination) as Observable<T>;
  }

  public disconnect(): Observable<void> {
    if (this.active) {
      this._setAuthenticationHeaders();
      return from(this.deactivate());
    }
    return of(void 0);
  }

  private _setAuthenticationHeaders() {
    const token = localStorage.getItem(TokenKeys.TOKEN);
    this.configure({
      connectHeaders: token ? { Authorization: 'Bearer ' + token } : undefined,
      disconnectHeaders: token ? { Authorization: 'Bearer ' + token } : undefined,
    });
  }

  public hotSocket(channel: string, size = 1) {
    return new HotSocket(this.multicast(channel), size);
  }
}

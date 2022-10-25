import { Injectable } from '@angular/core';
import { ApplicationMessage, TokenKeys } from '@app/ui/shared/domain';
import { RxStomp } from '@stomp/rx-stomp';
import { RxStompConfig } from '@stomp/rx-stomp/esm6/rx-stomp-config';
import { filter, from, Observable, of, share } from 'rxjs';
import { map } from 'rxjs/operators';
import { filterNulls } from '../utils/filter-null.rxjs.pipe';
import { HotSocket } from '../utils/hot-socket.model';

const brokerURL = (path: string): string => {
  const url = new URL(path, window.location.href);
  url.protocol = url.protocol.replace('http', 'ws');
  return url.href;
};

@Injectable({ providedIn: 'root' })
export class MessageService extends RxStomp {
  private readonly RX_STOMP_CONFIG: RxStompConfig = {
    brokerURL: brokerURL('/websocket'),
    connectionTimeout: 10000,
    heartbeatIncoming: 0,
    heartbeatOutgoing: 20000,
    reconnectDelay: 1000, // Wait in milliseconds before attempting auto reconnect
  };
  private readonly multicasts: Map<string, Observable<ApplicationMessage>> = new Map<
    string,
    Observable<ApplicationMessage>
  >();

  constructor() {
    super();
    this.configure(this.RX_STOMP_CONFIG);
  }

  public connect(): void {
    this._setAuthenticationHeaders();
    this.activate();
  }

  public listen<T extends ApplicationMessage = ApplicationMessage>(channel: string): Observable<T> {
    return this.watch(channel).pipe(
      filter((message) => !!message?.body),
      map((message) => JSON.parse(message.body)),
      filterNulls(),
    );
  }

  public multicast<T extends ApplicationMessage = ApplicationMessage>(channel: string): Observable<T> {
    if (!this.multicasts.has(channel)) {
      this.multicasts.set(channel, this.listen(channel).pipe(share()));
    }
    return this.multicasts.get(channel) as Observable<T>;
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

  public listener<T extends ApplicationMessage = ApplicationMessage>(channel: string, size = 1): HotSocket<T> {
    return new HotSocket<T>(this.listen(channel), size);
  }

  public multicaster<T extends ApplicationMessage = ApplicationMessage>(channel: string, size = 1): HotSocket<T> {
    return new HotSocket<T>(this.multicast(channel), size);
  }
}

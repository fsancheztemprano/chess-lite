import { Observable, ReplaySubject, Subscription } from 'rxjs';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ApplicationMessage {}

export const WEBSOCKET_REL = 'ws';

export class HotSocket<T extends ApplicationMessage> {
  private subscription: Subscription;
  private _messages$: ReplaySubject<T>;

  constructor(private readonly websocket: Observable<T>, private readonly size = 1) {
    this._messages$ = new ReplaySubject<T>(size);
    this.subscription = this.websocket.subscribe((message) => {
      this._messages$.next(message);
    });
  }

  get messages$(): Observable<T> {
    return this._messages$.asObservable();
  }

  disconnect(): void {
    this.subscription?.unsubscribe();
    this._messages$?.complete();
  }
}

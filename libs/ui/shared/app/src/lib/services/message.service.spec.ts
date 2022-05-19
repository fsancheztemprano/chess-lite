import { TestBed } from '@angular/core/testing';
import { IMessage } from '@stomp/stompjs';
import { firstValueFrom, of, tap } from 'rxjs';
import { HotSocket } from '../utils/hot-socket.model';
import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should listen to channel and parse message', (done) => {
    const message = { id: 'testId' };
    jest.spyOn(service, 'watch').mockReturnValueOnce(of({ body: JSON.stringify(message) } as IMessage));

    service.listen<{ id: string }>('/ami/user').subscribe((appMessage: { id: string }) => {
      expect(appMessage).toBeTruthy();
      expect(appMessage.id).toBeTruthy();
      done();
    });
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  it.each<any | jest.DoneCallback>([
    null,
    undefined,
    { body: null },
    { body: undefined },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ])('should filter nulls', (value: any, done: jest.DoneCallback) => {
    jest.spyOn(service, 'watch').mockReturnValueOnce(of(value as IMessage));

    service.listen<{ id: string }>('/ami/user').subscribe({
      next: () => done.fail('should not emit'),
      complete: () => done(),
    });
  });

  it('should set headers and activate', () => {
    const configureSpy = jest.spyOn(service, 'configure').mockImplementation();
    const activateSpy = jest.spyOn(service, 'activate').mockImplementation();

    service.connect();

    expect(configureSpy).toHaveBeenCalled();
    expect(activateSpy).toHaveBeenCalled();
  });

  it('should disconnect if active', (done) => {
    const deactivateSpy = jest.spyOn(service, 'deactivate').mockReturnValueOnce(firstValueFrom(of(void 0)));

    jest.spyOn(service, 'active', 'get').mockReturnValue(true);
    service.disconnect().subscribe(() => done());

    expect(deactivateSpy).toHaveBeenCalled();
  });

  it('should return disconnect if not active', (done) => {
    const deactivateSpy = jest.spyOn(service, 'deactivate').mockReturnValueOnce(firstValueFrom(of(void 0)));

    jest.spyOn(service, 'active', 'get').mockReturnValue(false);
    service.disconnect().subscribe(() => done());

    expect(deactivateSpy).not.toHaveBeenCalled();
  });

  it('should multicast channel', (done) => {
    const message = { id: 'testId' };
    const watchSpy = jest.spyOn(service, 'watch').mockReturnValue(of({ body: JSON.stringify(message) } as IMessage));

    const setMulticastSpy = jest.spyOn(service['multicasts'], 'set');
    const getMulticastSpy = jest.spyOn(service['multicasts'], 'get');

    service
      .multicast<{ id: string }>('/ami/user')
      .pipe(
        tap(() => {
          service.multicast<{ id: string }>('/ami/user').subscribe();
          service.multicast<{ id: string }>('/ami/user').subscribe();
          service.multicast<{ id: string }>('/ami/user').subscribe();
        }),
      )
      .subscribe((appMessage: { id: string }) => {
        expect(appMessage).toBeTruthy();
        expect(appMessage.id).toBeTruthy();
        done();
      });

    expect(watchSpy).toHaveBeenCalledTimes(1);
    expect(setMulticastSpy).toHaveBeenCalledTimes(1);
    expect(getMulticastSpy).toHaveBeenCalledTimes(4);
  });

  it('should create a hot socket from a listener', () => {
    jest.spyOn(service, 'listen');

    const listener = service.listener<{ id: string }>('/ami/user');

    expect(listener).toBeTruthy();
    expect(listener).toBeInstanceOf(HotSocket);
    expect(service.listen).toHaveBeenCalledTimes(1);
  });

  it('should create a hot socket from a multicaster', () => {
    jest.spyOn(service, 'multicast');

    const listener = service.multicaster<{ id: string }>('/ami/user');

    expect(listener).toBeTruthy();
    expect(listener).toBeInstanceOf(HotSocket);
    expect(service.multicast).toHaveBeenCalledTimes(1);
  });
});

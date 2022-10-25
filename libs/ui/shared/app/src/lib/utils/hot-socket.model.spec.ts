import { from, of, toArray } from 'rxjs';
import { HotSocket } from './hot-socket.model';

describe('HotSocket', () => {
  it('should create', () => {
    expect(new HotSocket(of({}))).toBeTruthy();
  });

  it('should connect and emit', (done) => {
    const message4 = { id: 4 };
    const hotSocket = new HotSocket(from([{ id: 1 }, { id: 2 }, { id: 3 }, message4]));

    hotSocket.messages$.subscribe({
      next: (m) => {
        expect(m).toEqual(message4);
        done();
      },
    });
  });

  it('should connect and hold the last emitted value', (done) => {
    const message4 = { id: 4 };
    const hotSocket = new HotSocket(from([{ id: 1 }, { id: 2 }, { id: 3 }, message4]));

    hotSocket.messages$.pipe(toArray()).subscribe({
      next: (emissions) => expect(emissions).toEqual([message4]),
      complete: () => done(),
    });

    hotSocket.disconnect();
  });

  it('should connect and hold the last 2 emitted values', (done) => {
    const message3 = { id: 3 };
    const message4 = { id: 4 };
    const hotSocket = new HotSocket(from([{ id: 1 }, { id: 2 }, message3, message4]));

    hotSocket.messages$.pipe(toArray()).subscribe({
      next: (emissions) => expect(emissions).toEqual([message3, message4]),
      complete: () => done(),
    });

    hotSocket.disconnect();
  });
});

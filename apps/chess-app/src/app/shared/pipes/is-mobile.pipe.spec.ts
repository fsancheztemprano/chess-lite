import { IsMobilePipe } from './is-mobile.pipe';
import { IsMobileService } from '../services/is-mobile.service';

class IsMobileServiceStub implements Partial<IsMobileService> {}

describe('IsMobilePipe', () => {
  let pipe: IsMobilePipe;

  beforeEach(() => {
    pipe = new IsMobilePipe(new IsMobileServiceStub() as IsMobileService);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { IsMobileService } from '../services/is-mobile.service';
import { IsMobilePipe } from './is-mobile.pipe';

describe('IsMobilePipe', () => {
  let pipe: IsMobilePipe;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsMobilePipe, IsMobileService],
    });
    pipe = TestBed.inject(IsMobilePipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return true if isMobile is true', (done) => {
    jest.spyOn(pipe['isMobileService'], 'isMobile$', 'get').mockReturnValue(of(true));
    pipe.transform().subscribe((isMobile) => {
      expect(isMobile).toBeTrue();
      done();
    });
  });

  it('should return true if isMobile is true', (done) => {
    jest.spyOn(pipe['isMobileService'], 'isMobile$', 'get').mockReturnValue(of(false));
    pipe.transform().subscribe((isMobile) => {
      expect(isMobile).toBeFalse();
      done();
    });
  });
});

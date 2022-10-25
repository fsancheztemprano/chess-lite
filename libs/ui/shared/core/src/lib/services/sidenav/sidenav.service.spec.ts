import { TestBed } from '@angular/core/testing';
import { firstValueFrom, Subject } from 'rxjs';
import { IsMobileModule, IsMobileService } from '../../modules/is-mobile';
import { SidenavService } from './sidenav.service';

describe('SidenavService', () => {
  let service: SidenavService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IsMobileModule],
    });
    service = TestBed.inject(SidenavService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start open', async () => {
    return expect(firstValueFrom(service.isOpen$)).resolves.toBeTrue();
  });

  it('should toggle to close', () => {
    service.toggle();
    return expect(firstValueFrom(service.isOpen$)).resolves.toBeFalse();
  });

  it('should toggle twice and re-open', () => {
    service.toggle();
    service.toggle();
    return expect(firstValueFrom(service.isOpen$)).resolves.toBeTrue();
  });

  it('should close when is mobile', () => {
    const isMobile = new Subject<boolean>();
    const isMobileService = {
      get isMobile$() {
        return isMobile;
      },
    };
    const sidenavService = new SidenavService(isMobileService as unknown as IsMobileService);

    expect(sidenavService['_isOpen$'].value).toBeTrue();

    isMobile.next(true);

    expect(sidenavService['_isOpen$'].value).toBeFalse();

    isMobile.next(true);

    expect(sidenavService['_isOpen$'].value).toBeFalse();

    isMobile.next(false);

    expect(sidenavService['_isOpen$'].value).toBeTrue();

    isMobile.next(false);

    expect(sidenavService['_isOpen$'].value).toBeTrue();
  });
});

import { TestBed } from '@angular/core/testing';
import { IsMobileModule } from '../../../../shared/modules/is-mobile/is-mobile.module';
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
});

import { TestBed } from '@angular/core/testing';
import { HalFormClientTestingModule } from '@hal-form-client/testing';
import { AdministrationService } from './administration.service';

describe('AdministrationService', () => {
  let service: AdministrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientTestingModule],
    });
    service = TestBed.inject(AdministrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

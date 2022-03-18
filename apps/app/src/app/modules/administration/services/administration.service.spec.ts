import { TestBed } from '@angular/core/testing';
import { HalFormClientModule } from '@hal-form-client';
import { AdministrationService } from './administration.service';

describe('AdministrationService', () => {
  let service: AdministrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientModule],
    });
    service = TestBed.inject(AdministrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

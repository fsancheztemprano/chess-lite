import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { stubHalFormServiceProvider } from '@chess-lite/hal-form-client/testing';

import { AdministrationService } from './administration.service';

describe('AdministrationService', () => {
  let service: AdministrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [stubHalFormServiceProvider],
    });
    service = TestBed.inject(AdministrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

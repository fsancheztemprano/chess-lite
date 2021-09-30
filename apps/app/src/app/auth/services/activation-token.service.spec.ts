import { TestBed } from '@angular/core/testing';
import { HalFormClientTestingModule } from '@hal-form-client/testing';
import { ActivationTokenService } from './activation-token.service';

describe('ActivationTokenService', () => {
  let service: ActivationTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientTestingModule],
    });
    service = TestBed.inject(ActivationTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

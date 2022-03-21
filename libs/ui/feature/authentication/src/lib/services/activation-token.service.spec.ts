import { TestBed } from '@angular/core/testing';
import { HalFormClientModule } from '@hal-form-client';
import { ActivationTokenService } from './activation-token.service';

describe('ActivationTokenService', () => {
  let service: ActivationTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientModule],
    });
    service = TestBed.inject(ActivationTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

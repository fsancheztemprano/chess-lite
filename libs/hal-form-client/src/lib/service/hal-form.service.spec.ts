import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HalFormClientModule } from '../hal-form-client.module';
import { HalFormService } from './hal-form.service';

describe('HalFormService', () => {
  let service: HalFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientModule.forRoot('/api'), HttpClientTestingModule],
    });
    service = TestBed.inject(HalFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { HalFormClientModule } from '@hal-form-client';
import { stubMessageServiceProvider } from './message.service.stub';
import { SessionService } from './session.service';
import { stubUserServiceProvider } from './user.service.stub';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientModule],
      providers: [stubUserServiceProvider, stubMessageServiceProvider],
    });
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

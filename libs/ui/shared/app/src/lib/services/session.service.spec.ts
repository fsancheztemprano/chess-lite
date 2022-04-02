import { TestBed } from '@angular/core/testing';
import { stubSessionRepositoryProvider } from '@app/ui/shared/store';
import { HalFormClientModule } from '@hal-form-client';
import { stubMessageServiceProvider } from './message.service.stub';
import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientModule],
      providers: [stubMessageServiceProvider, stubSessionRepositoryProvider],
    });
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { stubHalFormServiceProvider } from '@chess-lite/hal-form-client/testing';

import { UserRootService } from './user-root.service';

describe('UserRootService', () => {
  let service: UserRootService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [stubHalFormServiceProvider],
    });
    service = TestBed.inject(UserRootService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

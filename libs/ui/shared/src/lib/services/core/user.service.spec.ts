import { TestBed } from '@angular/core/testing';
import { HalFormClientModule } from '@hal-form-client';
import { stubMessageServiceProvider } from '../message.service.stub';
import { stubPreferencesServiceProvider } from '../preferences.service.stub';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientModule],
      providers: [stubMessageServiceProvider, stubPreferencesServiceProvider],
    });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

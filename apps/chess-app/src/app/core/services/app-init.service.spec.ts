import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { stubStubHalFormServiceProvider } from '@chess-lite/hal-form-client/testing';
import { stubStubAuthServiceProvider } from '../../auth/services/auth.service.stub';
import { AppInitService } from './app-init.service';

describe('AppInitService', () => {
  let service: AppInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [stubStubHalFormServiceProvider, stubStubAuthServiceProvider],
    });
    service = TestBed.inject(AppInitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

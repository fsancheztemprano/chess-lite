import { TestBed } from '@angular/core/testing';
import { AppInitService } from './app-init.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { stubStubHalFormServiceProvider } from '@chess-lite/hal-form-client/testing';

describe('AppInitService', () => {
  let service: AppInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [stubStubHalFormServiceProvider],
    });
    service = TestBed.inject(AppInitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { HalFormClientTestingModule } from '@hal-form-client/testing';
import { TranslateModule } from '@ngx-translate/core';
import { stubAuthServiceProvider } from '../../auth/services/auth.service.stub';
import { AppInitializationService } from './app-initialization.service';

describe('AppInitializationService', () => {
  let service: AppInitializationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HalFormClientTestingModule, TranslateModule.forRoot()],
      providers: [stubAuthServiceProvider],
    });
    service = TestBed.inject(AppInitializationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

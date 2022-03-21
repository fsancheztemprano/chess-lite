import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { stubAdministrationServiceProvider } from '../services/administration.service.stub';
import { AdministrationGuard } from './administration.guard';

describe('AdministrationGuard', () => {
  let guard: AdministrationGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [stubAdministrationServiceProvider],
    });
    guard = TestBed.inject(AdministrationGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

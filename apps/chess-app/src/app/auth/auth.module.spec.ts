import { AuthModule } from './auth.module';
import { TestBed, waitForAsync } from '@angular/core/testing';

describe('AuthModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [AuthModule],
      }).compileComponents();
    })
  );

  // TODO: Add real tests here.
  //
  // NB: This particular test does not do anything useful.
  //     It does NOT check for correct instantiation of the module.
  it('should have a module definition', () => {
    expect(AuthModule).toBeDefined();
  });

  it('should create a module', () => {
    expect(TestBed.inject(AuthModule)).toBeTruthy();
  });
});

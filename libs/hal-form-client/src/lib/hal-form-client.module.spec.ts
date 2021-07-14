import { TestBed, waitForAsync } from '@angular/core/testing';
import { HalFormClientModule } from './hal-form-client.module';

describe('HalFormClientModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HalFormClientModule],
      }).compileComponents();
    }),
  );

  // TODO: Add real tests here.
  //
  // NB: This particular test does not do anything useful.
  //     It does NOT check for correct instantiation of the module.
  it('should have a module definition', () => {
    expect(HalFormClientModule).toBeDefined();
  });

  it('should create a module', () => {
    expect(TestBed.inject(HalFormClientModule)).toBeTruthy();
  });
});

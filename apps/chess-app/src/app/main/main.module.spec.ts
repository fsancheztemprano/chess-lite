import { TestBed, waitForAsync } from '@angular/core/testing';
import { MainModule } from './main.module';

describe('MainModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MainModule],
      }).compileComponents();
    }),
  );

  // TODO: Add real tests here.
  //
  // NB: This particular test does not do anything useful.
  //     It does NOT check for correct instantiation of the module.
  it('should have a module definition', () => {
    expect(MainModule).toBeDefined();
  });

  it('should create a module', () => {
    expect(TestBed.inject(MainModule)).toBeTruthy();
  });
});

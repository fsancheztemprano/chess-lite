import { TestBed, waitForAsync } from '@angular/core/testing';
import { MainRoutingModule } from './main-routing.module';

describe('MainRoutingModule', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MainRoutingModule],
      }).compileComponents();
    })
  );

  // TODO: Add real tests here.
  //
  // NB: This particular test does not do anything useful.
  //     It does NOT check for correct instantiation of the module.
  it('should have a module definition', () => {
    expect(MainRoutingModule).toBeDefined();
  });

  it('should create a module', () => {
    expect(TestBed.inject(MainRoutingModule)).toBeTruthy();
  });
});

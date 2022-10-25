import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from './app.module';

describe(`AppModule`, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule],
    });
  });

  it('should create module', () => {
    expect(TestBed.inject(AppModule)).toBeTruthy();
  });
});

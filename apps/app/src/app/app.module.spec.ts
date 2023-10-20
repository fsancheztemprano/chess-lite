import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { getTranslocoModule } from '@app/ui/testing';
import { AppModule } from './app.module';

describe(`AppModule`, () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule, getTranslocoModule()],
    });
  });

  it('should create module', () => {
    expect(TestBed.inject(AppModule)).toBeTruthy();
  });
});

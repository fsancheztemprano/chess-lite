import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NgLetModule } from '../ng-let.module';

@NgModule({
  declarations: [],
  imports: [NgLetModule, CommonModule],
  exports: [NgLetModule],
})
class TestModule {}

describe('ngLet directive', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
    });
  });

  it('should create NgLetModule', () => {
    expect(new NgLetModule()).toBeTruthy();
  });
});

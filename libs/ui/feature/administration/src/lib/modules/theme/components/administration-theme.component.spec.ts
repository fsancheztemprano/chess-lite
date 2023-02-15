import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationThemeComponent } from './administration-theme.component';

describe('AdministrationThemeComponent', () => {
  let component: AdministrationThemeComponent;
  let fixture: ComponentFixture<AdministrationThemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdministrationThemeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdministrationThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

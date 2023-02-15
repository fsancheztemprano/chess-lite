import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StubCoreCardViewComponent, ThemeColorPickerComponent } from '@app/ui/shared/common';
import { HalFormClientTestingModule } from '@hal-form-client';
import { AdministrationThemeComponent } from './administration-theme.component';

describe('AdministrationThemeComponent', () => {
  let component: AdministrationThemeComponent;
  let fixture: ComponentFixture<AdministrationThemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HalFormClientTestingModule, ThemeColorPickerComponent, StubCoreCardViewComponent, RouterTestingModule],
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

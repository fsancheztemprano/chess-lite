import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalSettingsColorPickerComponent } from './global-settings-color-picker.component';

describe('GlobalSettingsColorPickerComponent', () => {
  let component: GlobalSettingsColorPickerComponent;
  let fixture: ComponentFixture<GlobalSettingsColorPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GlobalSettingsColorPickerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalSettingsColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

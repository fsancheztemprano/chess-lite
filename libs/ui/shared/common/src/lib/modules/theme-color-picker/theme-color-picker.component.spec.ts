import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxColorsComponent } from 'ngx-colors';
import { ThemeColorPickerComponent } from './theme-color-picker.component';

describe('ThemeColorPickerComponent', () => {
  let component: ThemeColorPickerComponent;
  let fixture: ComponentFixture<ThemeColorPickerComponent>;

  const colors = {
    primaryColor: '#00FFFF',
    accentColor: '#00FF00',
    warnColor: '#FF0000',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeColorPickerComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ThemeColorPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render 3 color pickers with input colors', () => {
    component.ngOnChanges({
      colors: {
        currentValue: colors,
        isFirstChange(): boolean {
          return true;
        },
        previousValue: undefined,
        firstChange: true,
      } as SimpleChange,
    });
    fixture.detectChanges();
    const inputs = fixture.debugElement.queryAll(By.css('ngx-colors'));
    expect(inputs.length).toEqual(3);
    inputs.forEach((colorPicker, index: number) => {
      expect((<NgxColorsComponent>colorPicker.componentInstance).color).toEqual(Object.values(colors)[index]);
    });
  });
});

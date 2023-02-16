import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { StubCoreCardViewComponent, ThemeColorPickerComponent } from '@app/ui/shared/common';
import { ThemeModel } from '@app/ui/shared/domain';
import { HalFormClientTestingModule } from '@hal-form-client';
import { of } from 'rxjs';
import { AdministrationThemeComponent } from './administration-theme.component';

describe('AdministrationThemeComponent', () => {
  let component: AdministrationThemeComponent;
  let fixture: ComponentFixture<AdministrationThemeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HalFormClientTestingModule, ThemeColorPickerComponent, RouterTestingModule],
      declarations: [AdministrationThemeComponent, StubCoreCardViewComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                theme: new ThemeModel({
                  primaryColor: '#FF0000',
                  accentColor: '#00FF00',
                  warnColor: '#0000FF',
                }),
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdministrationThemeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get theme from route', () => {
    expect(component.themeResource).toBeTruthy();
    expect(component.themeResource?.primaryColor).toBe('#FF0000');
    expect(component.themeResource?.accentColor).toBe('#00FF00');
    expect(component.themeResource?.warnColor).toBe('#0000FF');
  });

  it('should update theme on color changes', () => {
    const updatedTheme = new ThemeModel({ primaryColor: '#000000' });
    const updateThemeSpy = jest.spyOn(component['themeService'], 'updateTheme').mockReturnValueOnce(of(updatedTheme));
    const dispatchSpy = jest.spyOn(component['actions'], 'dispatch');
    component.colorChanges(updatedTheme);
    expect(updateThemeSpy).toHaveBeenCalledTimes(1);
    expect(updateThemeSpy).toHaveBeenCalledWith(component.themeResource, updatedTheme);

    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith({ type: '[Theme] Update Theme', ...updatedTheme });
  });
});

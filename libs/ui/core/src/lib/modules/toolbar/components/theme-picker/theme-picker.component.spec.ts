import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSlideToggleHarness } from '@angular/material/slide-toggle/testing';
import { By } from '@angular/platform-browser';
import {
  NgLetModule,
  stubIsMobileServiceProvider,
  stubThemeRepositoryProvider,
  ThemeRepository,
} from '@app/ui/shared/core';
import { Actions, EffectsNgModule } from '@ngneat/effects-ng';
import { ThemePickerComponent } from './theme-picker.component';

describe('ThemeComponent', () => {
  let component: ThemePickerComponent;
  let fixture: ComponentFixture<ThemePickerComponent>;
  let themeRepository: ThemeRepository;
  let loader: HarnessLoader;
  let customActionsStream: Actions;

  beforeEach(async () => {
    customActionsStream = new Actions();
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatButtonModule,
        MatSlideToggleModule,
        ReactiveFormsModule,
        EffectsNgModule.forRoot([], { customActionsStream }),
        NgLetModule,
      ],
      declarations: [ThemePickerComponent],
      providers: [stubThemeRepositoryProvider, stubIsMobileServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);

    themeRepository = TestBed.inject(ThemeRepository);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('mobile button toggle', () => {
    let toggleButton: DebugElement;
    beforeEach(() => {
      fixture.detectChanges();
      toggleButton = fixture.debugElement.query(By.css('button[aria-label="Theme Toggle"]'));
    });

    it('should render button toggle', async () => {
      expect(toggleButton).toBeTruthy();
      return expect(loader.getHarness(MatSlideToggleHarness)).rejects.toBeTruthy();
    });

    it('should update dark mode button toggle from datasource', () => {
      expect(toggleButton.nativeElement.textContent).toEqual('bedtime');

      themeRepository.updateDarkMode(true);
      fixture.detectChanges();

      expect(toggleButton.nativeElement.textContent).toEqual('brightness_5');
    });

    it('should dispatch action on button toggle', async () => {
      const actionsSpy = jest.spyOn(component['actions'], 'dispatch');

      toggleButton.nativeElement.click();

      expect(actionsSpy).toHaveBeenCalledTimes(1);
      expect(actionsSpy).toHaveBeenLastCalledWith({ darkMode: true, type: '[Theme] Update Dark Mode' });
    });
  });
});

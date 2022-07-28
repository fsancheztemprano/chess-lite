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
  IsMobileModule,
  IsMobileService,
  NgLetModule,
  stubIsMobileServiceProvider,
  stubThemeRepositoryProvider,
  ThemeRepository,
} from '@app/ui/shared/core';
import { Actions, EffectsNgModule } from '@ngneat/effects-ng';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
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
        IsMobileModule,
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

  describe('desktop slide toggle', () => {
    beforeEach(() => {
      (TestBed.inject(IsMobileService)['isHandset'] as BehaviorSubject<boolean>).next(false);
    });

    it('should render slide toggle', async () => {
      const toggleButton = fixture.debugElement.query(By.css('button[aria-label="Theme Toggle"]'));

      expect(toggleButton).toBeFalsy();
      expect(await loader.getHarness(MatSlideToggleHarness)).toBeTruthy();
    });

    it('should update dark mode slide toggle from datasource', async () => {
      const matSlideToggleHarness = await loader.getHarness(MatSlideToggleHarness);

      expect(await matSlideToggleHarness.isChecked()).toBeFalse();

      themeRepository.updateDarkMode(true);

      expect(await matSlideToggleHarness.isChecked()).toBeTrue();
    });

    it('should dispatch action on slide toggle', async () => {
      const matSlideToggleHarness = await loader.getHarness(MatSlideToggleHarness);

      matSlideToggleHarness.toggle();

      expect(await firstValueFrom(customActionsStream)).toEqual({ darkMode: true, type: '[Theme] Update Dark Mode' });
    });
  });

  describe('mobile button toggle', () => {
    let toggleButton: DebugElement;
    beforeEach(() => {
      (TestBed.inject(IsMobileService)['isHandset'] as BehaviorSubject<boolean>).next(true);
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

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSlideToggleHarness } from '@angular/material/slide-toggle/testing';
import { stubThemeRepositoryProvider, ThemeRepository } from '@app/ui/shared/core';
import { Actions, EffectsNgModule } from '@ngneat/effects-ng';
import { firstValueFrom } from 'rxjs';
import { ThemePickerComponent } from './theme-picker.component';

describe('ThemeComponent', () => {
  let component: ThemePickerComponent;
  let fixture: ComponentFixture<ThemePickerComponent>;
  let themeRepository: ThemeRepository;
  let loader: HarnessLoader;
  const customActionsStream = new Actions();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatSlideToggleModule,
        ReactiveFormsModule,
        EffectsNgModule.forRoot([], { customActionsStream }),
      ],
      declarations: [ThemePickerComponent],
      providers: [stubThemeRepositoryProvider],
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

  it('should update dark mode toggle from datasource', async () => {
    const matSlideToggleHarness = await loader.getHarness(MatSlideToggleHarness);

    expect(await matSlideToggleHarness.isChecked()).toBeFalse();

    themeRepository.updateDarkMode(true);

    expect(await matSlideToggleHarness.isChecked()).toBeTrue();
  });

  it('should dispatch action on toggle', async () => {
    const matSlideToggleHarness = await loader.getHarness(MatSlideToggleHarness);

    matSlideToggleHarness.toggle();

    expect(await firstValueFrom(customActionsStream)).toEqual({ darkMode: true, type: '[Theme] Update Dark Mode' });
  });
});

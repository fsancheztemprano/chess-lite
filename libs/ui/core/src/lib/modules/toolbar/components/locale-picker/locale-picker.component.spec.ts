import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { stubLocalizationRepositoryProvider } from '@app/ui/shared/core';
import { getTranslocoModule } from '@app/ui/testing';
import { Actions, EffectsNgModule } from '@ngneat/effects-ng';
import { Iso3166Pipe } from '../../pipes/iso3166.pipe';
import { LocalePickerComponent } from './locale-picker.component';

describe('LocalePickerComponent', () => {
  let component: LocalePickerComponent;
  let fixture: ComponentFixture<LocalePickerComponent>;
  let loader: HarnessLoader;

  const customActionsStream = new Actions();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatMenuModule,
        MatButtonModule,
        getTranslocoModule(),
        NoopAnimationsModule,
        EffectsNgModule.forRoot([], { customActionsStream }),
      ],
      declarations: [LocalePickerComponent, Iso3166Pipe],
      providers: [stubLocalizationRepositoryProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalePickerComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeTruthy();
    expect(await loader.getHarness(MatMenuHarness)).toBeTruthy();
  });

  it('should render picker button with current language flag', async () => {
    expect(fixture.debugElement.query(By.css('img[src="./assets/flags/gb.png"]'))).toBeTruthy();
  });

  it('should render menu with options for available languages', async () => {
    const matMenuHarness = await loader.getHarness(MatMenuHarness);
    await matMenuHarness.open();

    const items = await matMenuHarness.getItems();

    expect(items.length).toBe(2);
  });

  it('should change content language on menu item click', async () => {
    const spyInstance = jest.spyOn(component['actions'], 'dispatch');
    const matMenuHarness = await loader.getHarness(MatMenuHarness);
    await matMenuHarness.open();

    const items = await matMenuHarness.getItems();

    await items[0].click();

    expect(spyInstance).toHaveBeenCalledWith({
      contentLanguage: 'en',
      type: '[Localization] Update Content Language',
    });
  });
});

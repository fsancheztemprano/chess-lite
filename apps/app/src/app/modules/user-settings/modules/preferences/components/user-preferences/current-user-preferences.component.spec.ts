import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SubscribeModule } from '@ngneat/subscribe';
import { stubThemeServiceProvider } from '../../../../../../core/services/theme.service.stub';
import { stubToasterServiceProvider } from '../../../../../../core/services/toaster.service.stub';
import { stubTranslationServiceProvider } from '../../../../../../core/services/translation.service.stub';
import { FormErrorModule } from '../../../../../../shared/modules/form-error/form-error.module';
import { stubUserSettingsServiceProvider } from '../../../../services/user-settings.service.stub';
import { CurrentUserPreferencesComponent } from './current-user-preferences.component';

describe('CurrentUserPreferencesComponent', () => {
  let component: CurrentUserPreferencesComponent;
  let fixture: ComponentFixture<CurrentUserPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        ReactiveFormsModule,
        MatIconModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatSelectModule,
        FormErrorModule,
        SubscribeModule,
      ],
      declarations: [CurrentUserPreferencesComponent],
      providers: [
        stubThemeServiceProvider,
        stubToasterServiceProvider,
        stubTranslationServiceProvider,
        stubUserSettingsServiceProvider,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentUserPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

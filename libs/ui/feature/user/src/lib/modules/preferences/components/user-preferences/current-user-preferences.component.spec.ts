import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  FormErrorModule,
  stubThemeServiceProvider,
  stubToasterServiceProvider,
  stubTranslationServiceProvider,
} from '@app/ui/shared';
import { SubscribeModule } from '@ngneat/subscribe';
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { stubToasterServiceProvider } from '@app/ui/shared/app';
import { FormErrorModule, StubCoreCardViewComponent } from '@app/ui/shared/common';
import { stubLocalizationRepositoryProvider, stubUserSettingsServiceProvider } from '@app/ui/shared/core';
import { getTranslocoModule } from '@app/ui/testing';
import { SubscribeModule } from '@ngneat/subscribe';
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
        getTranslocoModule(),
      ],
      declarations: [CurrentUserPreferencesComponent, StubCoreCardViewComponent],
      providers: [stubToasterServiceProvider, stubUserSettingsServiceProvider, stubLocalizationRepositoryProvider],
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

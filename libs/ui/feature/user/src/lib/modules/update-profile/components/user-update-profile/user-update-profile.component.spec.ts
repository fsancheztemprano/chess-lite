import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { stubToasterServiceProvider } from '@app/ui/shared/app';
import { StubFormErrorComponent } from '@app/ui/shared/common';
import { NgLetModule, stubCardViewHeaderServiceProvider, stubUserSettingsServiceProvider } from '@app/ui/shared/core';
import { UserUpdateProfileComponent } from './user-update-profile.component';

describe('UserUpdateProfileComponent', () => {
  let component: UserUpdateProfileComponent;
  let fixture: ComponentFixture<UserUpdateProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NgLetModule,
      ],
      declarations: [UserUpdateProfileComponent, StubFormErrorComponent],
      providers: [
        MatDatepickerModule,
        stubUserSettingsServiceProvider,
        stubCardViewHeaderServiceProvider,
        stubToasterServiceProvider,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserUpdateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

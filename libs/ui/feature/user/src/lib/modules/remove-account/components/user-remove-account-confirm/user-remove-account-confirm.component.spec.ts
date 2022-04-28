import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgLetModule, stubUserSettingsServiceProvider } from '@app/ui/shared/core';
import { UserRemoveAccountConfirmComponent } from './user-remove-account-confirm.component';

describe('UserRemoveAccountConfirmComponent', () => {
  let component: UserRemoveAccountConfirmComponent;
  let fixture: ComponentFixture<UserRemoveAccountConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatFormFieldModule, MatInputModule, NoopAnimationsModule, NgLetModule],
      declarations: [UserRemoveAccountConfirmComponent],
      providers: [stubUserSettingsServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRemoveAccountConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

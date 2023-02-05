import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { stubToasterServiceProvider } from '@app/ui/shared/app';
import { StubCoreCardViewComponent } from '@app/ui/shared/common';
import { NgLetModule, stubUserSettingsServiceProvider } from '@app/ui/shared/core';
import { getTranslocoModule } from '@app/ui/testing';
import { UserRemoveAccountComponent } from './user-remove-account.component';

describe('UserRemoveAccountComponent', () => {
  let component: UserRemoveAccountComponent;
  let fixture: ComponentFixture<UserRemoveAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatCardModule, NgLetModule, RouterTestingModule, getTranslocoModule()],
      declarations: [UserRemoveAccountComponent, StubCoreCardViewComponent],
      providers: [stubUserSettingsServiceProvider, stubToasterServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRemoveAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

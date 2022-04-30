import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { stubToasterServiceProvider } from '@app/ui/shared/app';
import { StubCoreCardViewComponent } from '@app/ui/shared/common';
import { NgLetModule, stubCardViewHeaderServiceProvider, stubUserSettingsServiceProvider } from '@app/ui/shared/core';
import { getTranslocoModule } from '@app/ui/testing';
import { UserRemoveAccountComponent } from './user-remove-account.component';

describe('UserRemoveAccountComponent', () => {
  let component: UserRemoveAccountComponent;
  let fixture: ComponentFixture<UserRemoveAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatCardModule, NgLetModule, RouterTestingModule, getTranslocoModule()],
      declarations: [UserRemoveAccountComponent, StubCoreCardViewComponent],
      providers: [stubUserSettingsServiceProvider, stubCardViewHeaderServiceProvider, stubToasterServiceProvider],
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

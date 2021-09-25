import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { stubHeaderServiceProvider } from '../../../../../../core/services/header.service.stub';
import { NgLetModule } from '../../../../../../shared/directives/ng-let.directive';
import { stubToasterServiceProvider } from '../../../../../../shared/services/toaster.service.stub';
import { stubUserSettingsServiceProvider } from '../../../../services/user-settings.service.stub';
import { UserRemoveAccountComponent } from './user-remove-account.component';

describe('UserRemoveAccountComponent', () => {
  let component: UserRemoveAccountComponent;
  let fixture: ComponentFixture<UserRemoveAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatCardModule, NgLetModule, RouterTestingModule],
      declarations: [UserRemoveAccountComponent],
      providers: [stubUserSettingsServiceProvider, stubHeaderServiceProvider, stubToasterServiceProvider],
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

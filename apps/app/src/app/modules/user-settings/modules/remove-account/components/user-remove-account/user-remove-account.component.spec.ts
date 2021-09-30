import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { stubCardViewHeaderServiceProvider } from '../../../../../../core/modules/card-view/services/card-view-header.service.stub';
import { stubToasterServiceProvider } from '../../../../../../core/services/toaster.service.stub';
import { NgLetModule } from '../../../../../../shared/modules/ng-let/ng-let.module';
import { stubUserSettingsServiceProvider } from '../../../../services/user-settings.service.stub';
import { UserRemoveAccountComponent } from './user-remove-account.component';

describe('UserRemoveAccountComponent', () => {
  let component: UserRemoveAccountComponent;
  let fixture: ComponentFixture<UserRemoveAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatCardModule, NgLetModule, RouterTestingModule],
      declarations: [UserRemoveAccountComponent],
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

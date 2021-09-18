import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { stubToasterServiceProvider } from '../../../../../../../../../../shared/services/toaster.service.stub';
import { UserManagementAccountTokenComponent } from './user-management-account-token.component';

describe('UserManagementAccountTokenComponent', () => {
  let component: UserManagementAccountTokenComponent;
  let fixture: ComponentFixture<UserManagementAccountTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatCardModule, MatButtonModule],
      declarations: [UserManagementAccountTokenComponent],
      providers: [stubToasterServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementAccountTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

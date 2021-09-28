import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { stubToasterServiceProvider } from '../../../../../../../../../../core/services/toaster.service.stub';
import { NgLetModule } from '../../../../../../../../../../shared/modules/ng-let/ng-let.module';
import { stubUserManagementDetailServiceProvider } from '../../../../services/user-management-detail.service.stub';
import { UserManagementAuthoritiesComponent } from './user-management-authorities.component';

describe('UserManagementAuthoritiesComponent', () => {
  let component: UserManagementAuthoritiesComponent;
  let fixture: ComponentFixture<UserManagementAuthoritiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, ReactiveFormsModule, NgLetModule],
      declarations: [UserManagementAuthoritiesComponent],
      providers: [stubToasterServiceProvider, stubUserManagementDetailServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementAuthoritiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

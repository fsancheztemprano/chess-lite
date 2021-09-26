import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NgLetModule } from '../../../../../../../../../../shared/directives/ng-let.directive';
import { stubToasterServiceProvider } from '../../../../../../../../../../shared/services/toaster.service.stub';
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

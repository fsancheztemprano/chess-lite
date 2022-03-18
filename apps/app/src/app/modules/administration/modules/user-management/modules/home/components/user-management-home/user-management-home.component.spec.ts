import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StubTiledMenuModule } from '@app/ui/shared';
import { stubCoreServiceProvider } from '../../../../../../../../core/services/core.service.stub';
import { stubUserManagementServiceProvider } from '../../../../services/user-management.service.stub';
import { UserManagementHomeComponent } from './user-management-home.component';

describe('UserManagementHomeComponent', () => {
  let component: UserManagementHomeComponent;
  let fixture: ComponentFixture<UserManagementHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StubTiledMenuModule],
      declarations: [UserManagementHomeComponent],
      providers: [stubCoreServiceProvider, stubUserManagementServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

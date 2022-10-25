import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { AdministrationRelations } from '@app/ui/shared/domain';
import { stubAdministrationServiceProvider } from '@app/ui/shared/feature/administration';
import { getTranslocoModule } from '@app/ui/testing';
import { HalFormClientModule, HalFormService } from '@hal-form-client';
import { StubSidenavItemComponent } from '../../sidenav-item/sidenav-item.component.stub';
import { AdministrationSidenavItemComponent } from './administration-sidenav-item.component';

describe('AdministrationSidenavItemComponent', () => {
  let component: AdministrationSidenavItemComponent;
  let fixture: ComponentFixture<AdministrationSidenavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HalFormClientModule, getTranslocoModule()],
      declarations: [AdministrationSidenavItemComponent, StubSidenavItemComponent],
      providers: [stubAdministrationServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrationSidenavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have link to administration', () => {
    expect(component.items).toPartiallyContain({ route: '/administration' });
  });

  it('should have link to user management', () => {
    expect(component.items).toPartiallyContain({ route: ['/administration', 'user-management'] });
  });

  it('should have link to role management', () => {
    expect(component.items).toPartiallyContain({ route: ['/administration', 'role-management'] });
  });

  it('should have link to service logs', () => {
    expect(component.items).toPartiallyContain({ route: ['/administration', 'service-logs'] });
  });

  it('should have link to global settings', () => {
    expect(component.items).toPartiallyContain({ route: ['/administration', 'global-settings'] });
  });

  it('should not render if administration link is not available', () => {
    expect(fixture.debugElement.query(By.css('app-sidenav-item'))).toBeFalsy();
  });

  it('should render if administration link is available', () => {
    TestBed.inject(HalFormService).setResource({
      _links: {
        self: { href: '/api' },
        [AdministrationRelations.ADMINISTRATION_REL]: { href: '/administration' },
      },
    });

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-sidenav-item'))).toBeTruthy();
  });
});

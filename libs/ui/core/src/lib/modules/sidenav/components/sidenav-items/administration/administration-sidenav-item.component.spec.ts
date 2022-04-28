import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { stubAdministrationServiceProvider } from '@app/ui/shared/feature/administration';
import { getTranslocoModule } from '@app/ui/testing';
import { HalFormClientModule } from '@hal-form-client';
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
});

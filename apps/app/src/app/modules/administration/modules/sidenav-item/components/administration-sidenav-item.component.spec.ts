import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { stubAdministrationServiceProvider } from '../../../services/administration.service.stub';
import { AdministrationSidenavItemComponent } from './administration-sidenav-item.component';

describe('AdministrationSidenavItemComponent', () => {
  let component: AdministrationSidenavItemComponent;
  let fixture: ComponentFixture<AdministrationSidenavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, MatExpansionModule, MatIconModule, NoopAnimationsModule],
      declarations: [AdministrationSidenavItemComponent],
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { stubAdministrationServiceProvider } from '../../../services/administration.service.stub';
import { AdministrationSidenavItemComponent } from './administration-sidenav-item.component';

describe('AdministrationSidenavItemComponent', () => {
  let component: AdministrationSidenavItemComponent;
  let fixture: ComponentFixture<AdministrationSidenavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [],
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

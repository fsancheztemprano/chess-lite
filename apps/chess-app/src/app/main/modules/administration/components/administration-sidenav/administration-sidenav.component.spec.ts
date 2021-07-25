import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { stubAdministrationServiceProvider } from '../../services/administration.service.stub';

import { AdministrationSidenavComponent } from './administration-sidenav.component';

describe('AdministrationSidenavComponent', () => {
  let component: AdministrationSidenavComponent;
  let fixture: ComponentFixture<AdministrationSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatListModule],
      declarations: [AdministrationSidenavComponent],
      providers: [stubAdministrationServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrationSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

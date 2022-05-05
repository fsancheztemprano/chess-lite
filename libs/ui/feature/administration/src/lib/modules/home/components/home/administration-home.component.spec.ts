import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StubTiledMenuModule } from '@app/ui/shared/common';
import { stubAdministrationServiceProvider } from '@app/ui/shared/feature/administration';
import { getTranslocoModule } from '@app/ui/testing';
import { AdministrationHomeComponent } from './administration-home.component';

describe('AdministrationHomeComponent', () => {
  let component: AdministrationHomeComponent;
  let fixture: ComponentFixture<AdministrationHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, StubTiledMenuModule, getTranslocoModule()],
      declarations: [AdministrationHomeComponent],
      providers: [stubAdministrationServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrationHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

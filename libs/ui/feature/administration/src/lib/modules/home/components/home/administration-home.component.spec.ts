import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StubTiledMenuModule } from '@app/ui/shared/common';
import { stubCoreServiceProvider } from '@app/ui/shared/core';
import { stubAdministrationServiceProvider } from '../../../../services/administration.service.stub';
import { AdministrationHomeComponent } from './administration-home.component';

describe('AdministrationHomeComponent', () => {
  let component: AdministrationHomeComponent;
  let fixture: ComponentFixture<AdministrationHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, StubTiledMenuModule],
      declarations: [AdministrationHomeComponent],
      providers: [stubCoreServiceProvider, stubAdministrationServiceProvider],
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

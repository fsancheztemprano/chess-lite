import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { stubCoreServiceProvider } from '../../../../../../core/services/core.service.stub';
import { StubTiledMenuModule } from '../../../../../../shared/modules/tiled-menu/components/tiled-menu/tiled-menu.component.stub';
import { AdministrationHomeComponent } from './administration-home.component';

describe('AdministrationHomeComponent', () => {
  let component: AdministrationHomeComponent;
  let fixture: ComponentFixture<AdministrationHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, StubTiledMenuModule],
      declarations: [AdministrationHomeComponent],
      providers: [stubCoreServiceProvider],
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

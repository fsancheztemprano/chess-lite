import { ComponentFixture, TestBed } from '@angular/core/testing';
import { stubCoreServiceProvider } from '../../../../core/services/core.service.stub';
import { StubTiledMenuModule } from '../../../../shared/modules/tiled-menu/components/tiled-menu/tiled-menu.component.stub';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StubTiledMenuModule],
      declarations: [HomeComponent],
      providers: [stubCoreServiceProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

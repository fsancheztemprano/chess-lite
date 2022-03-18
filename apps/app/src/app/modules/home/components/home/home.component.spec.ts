import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StubTiledMenuModule } from '@app/ui/shared';
import { HalFormClientModule } from '@hal-form-client';
import { stubCoreServiceProvider } from '../../../../core/services/core.service.stub';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StubTiledMenuModule, HalFormClientModule],
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getTranslocoModule } from '@app/ui/testing';
import { StubSidenavItemComponent } from '../../sidenav-item/sidenav-item.component.stub';
import { HomeSidenavItemComponent } from '../home/home-sidenav-item.component';

describe('HomeSidenavItemComponent', () => {
  let component: HomeSidenavItemComponent;
  let fixture: ComponentFixture<HomeSidenavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [getTranslocoModule()],
      declarations: [HomeSidenavItemComponent, StubSidenavItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSidenavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

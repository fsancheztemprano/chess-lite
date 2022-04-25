import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StubSidenavItemComponent } from '@app/ui/shared/common';
import { getTranslocoModule } from '@app/ui/testing';
import { HomeSidenavItemComponent } from './home-sidenav-item.component';

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

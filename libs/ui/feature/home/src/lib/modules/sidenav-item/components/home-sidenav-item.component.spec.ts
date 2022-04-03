import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StubSidenavItemComponent } from '@app/ui/shared/common';
import { HomeSidenavItemComponent } from './home-sidenav-item.component';

describe('HomeSidenavItemComponent', () => {
  let component: HomeSidenavItemComponent;
  let fixture: ComponentFixture<HomeSidenavItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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

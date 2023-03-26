import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SidebarButtonComponent } from './sidebar-button.component';

describe('SidebarButtonComponent', () => {
  let component: SidebarButtonComponent;
  let fixture: ComponentFixture<SidebarButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatIconModule, MatButtonModule],
      declarations: [SidebarButtonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StubContextMenuComponent } from '../../context-menu/components/context-menu.component.stub';

import { CoreContextMenuComponent } from './core-context-menu.component';

describe('CoreContextMenuComponent', () => {
  let component: CoreContextMenuComponent;
  let fixture: ComponentFixture<CoreContextMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CoreContextMenuComponent, StubContextMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

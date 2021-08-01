import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IsMobileModule } from '@app/shared';
import { HeaderComponent } from '../header/header.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

import { CoreComponent } from './core.component';

@Component({ selector: 'chess-lite-toolbar', template: '' })
class StubToolbarComponent implements Partial<ToolbarComponent> {}

@Component({ selector: 'chess-lite-sidenav', template: '' })
class StubSidenavComponent implements Partial<SidenavComponent> {}

@Component({ selector: 'chess-lite-header', template: '' })
class StubHeaderComponent implements Partial<HeaderComponent> {}

describe('CoreComponent', () => {
  let component: CoreComponent;
  let fixture: ComponentFixture<CoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, IsMobileModule],
      declarations: [CoreComponent, StubToolbarComponent, StubSidenavComponent, StubHeaderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

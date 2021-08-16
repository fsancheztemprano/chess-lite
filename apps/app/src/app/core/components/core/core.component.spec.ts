import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { IsMobileModule } from '../../../shared/pipes/is-mobile.pipe';
import { stubThemeServiceProvider } from '../../services/theme.service.stub';
import { HeaderComponent } from '../header/header.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

import { CoreComponent } from './core.component';

@Component({ selector: 'app-toolbar', template: '' })
class StubToolbarComponent implements Partial<ToolbarComponent> {}

@Component({ selector: 'app-sidenav', template: '' })
class StubSidenavComponent implements Partial<SidenavComponent> {}

@Component({ selector: 'app-header', template: '' })
class StubHeaderComponent implements Partial<HeaderComponent> {}

describe('CoreComponent', () => {
  let component: CoreComponent;
  let fixture: ComponentFixture<CoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, IsMobileModule, MatCardModule],
      declarations: [CoreComponent, StubToolbarComponent, StubSidenavComponent, StubHeaderComponent],
      providers: [stubThemeServiceProvider],
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

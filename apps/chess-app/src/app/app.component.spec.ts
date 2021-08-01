import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IsMobileModule } from '@app/shared';
import { AppComponent } from './app.component';
import { HeaderComponent } from './core/components/main-container/header.component';
import { SidenavComponent } from './core/components/sidenav/sidenav.component';
import { ToolbarComponent } from './core/components/toolbar/toolbar.component';

@Component({ selector: 'chess-lite-toolbar', template: '' })
class StubToolbarComponent implements Partial<ToolbarComponent> {}

@Component({ selector: 'chess-lite-sidenav', template: '' })
class StubSidenavComponent implements Partial<SidenavComponent> {}

@Component({ selector: 'chess-lite-header', template: '' })
class StubHeaderComponent implements Partial<HeaderComponent> {}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, IsMobileModule],
      declarations: [AppComponent, StubToolbarComponent, StubSidenavComponent, StubHeaderComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

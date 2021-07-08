import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { SidenavComponent } from './core/components/sidenav/sidenav.component';
import { ToolbarComponent } from './core/components/toolbar/toolbar.component';

@Component({ selector: 'chess-lite-toolbar', template: '' })
export class StubToolbarComponent implements Partial<ToolbarComponent> {}

@Component({ selector: 'chess-lite-sidenav', template: '' })
export class StubSidenavComponent implements Partial<SidenavComponent> {}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent, StubToolbarComponent, StubSidenavComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

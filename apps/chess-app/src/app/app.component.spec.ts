import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { DummyComponent } from './shared/components/dummy/dummy.component';
import { Component } from '@angular/core';
import { ToolbarComponent } from './core/components/toolbar/toolbar.component';
import { SidenavComponent } from './core/components/sidenav/sidenav.component';

@Component({ selector: 'chess-lite-toolbar', template: '' })
export class StubToolbarComponent implements Partial<ToolbarComponent> {}

@Component({ selector: 'chess-lite-sidenav', template: '' })
export class StubSidenavComponent implements Partial<SidenavComponent> {}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        DummyComponent,
        StubToolbarComponent,
        StubSidenavComponent,
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});

import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import { IsMobileModule } from '../../../shared/modules/is-mobile/is-mobile.module';
import { CardViewComponent } from '../../modules/card-view/components/card-view/card-view.component';
import { SidenavComponent } from '../../modules/sidenav/components/sidenav/sidenav.component';
import { ToolbarComponent } from '../../modules/toolbar/components/toolbar/toolbar.component';
import { stubCoreServiceProvider } from '../../services/core.service.stub';
import { stubThemeServiceProvider } from '../../services/theme.service.stub';
import { CoreComponent } from './core.component';

@Component({ selector: 'app-toolbar', template: '' })
class StubToolbarComponent implements Partial<ToolbarComponent> {}

@Component({ selector: 'app-sidenav', template: '' })
class StubSidenavComponent implements Partial<SidenavComponent> {}

@Component({ selector: 'app-card-view', template: '' })
class StubCardViewComponent implements Partial<CardViewComponent> {}

describe('CoreComponent', () => {
  let component: CoreComponent;
  let fixture: ComponentFixture<CoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, IsMobileModule, MatCardModule],
      declarations: [CoreComponent, StubToolbarComponent, StubSidenavComponent, StubCardViewComponent],
      providers: [stubThemeServiceProvider, stubCoreServiceProvider],
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

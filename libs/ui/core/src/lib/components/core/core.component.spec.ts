import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { RouterTestingModule } from '@angular/router/testing';
import {
  IsMobileModule,
  NgLetModule,
  StubThemeRepository,
  stubThemeRepositoryProvider,
  ThemeRepository,
} from '@app/ui/shared/core';
import { SidenavComponent } from '../../modules/sidenav/components/sidenav/sidenav.component';
import { ToolbarComponent } from '../../modules/toolbar/components/toolbar/toolbar.component';
import { CoreComponent } from './core.component';

@Component({ selector: 'app-toolbar', template: '' })
class StubToolbarComponent implements Partial<ToolbarComponent> {}

@Component({ selector: 'app-sidenav', template: '' })
class StubSidenavComponent implements Partial<SidenavComponent> {}

describe('CoreComponent', () => {
  let component: CoreComponent;
  let fixture: ComponentFixture<CoreComponent>;
  let stubThemeRepository: StubThemeRepository;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, IsMobileModule, MatCardModule, NgLetModule],
      declarations: [CoreComponent, StubToolbarComponent, StubSidenavComponent],
      providers: [stubThemeRepositoryProvider],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    stubThemeRepository = TestBed.inject(ThemeRepository) as StubThemeRepository;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render toolbar', () => {
    expect(fixture.nativeElement.querySelector('app-toolbar')).toBeTruthy();
  });

  it('should render sidenav', () => {
    expect(fixture.nativeElement.querySelector('app-sidenav')).toBeTruthy();
  });

  it('should update dark-mode class from datasource', () => {
    expect(fixture.debugElement.classes).toEqual({ '': true });

    stubThemeRepository.updateDarkMode(true);

    fixture.detectChanges();

    expect(fixture.debugElement.classes).toEqual({ 'dark-mode': true });

    stubThemeRepository.updateDarkMode(false);

    fixture.detectChanges();

    expect(fixture.debugElement.classes).toEqual({ '': true });
  });
});

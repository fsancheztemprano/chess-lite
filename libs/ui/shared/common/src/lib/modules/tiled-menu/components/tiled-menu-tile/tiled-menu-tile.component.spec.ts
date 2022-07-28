import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { TiledMenuTileComponent } from './tiled-menu-tile.component';

describe('TiledMenuTileComponent', () => {
  let component: TiledMenuTileComponent;
  let fixture: ComponentFixture<TiledMenuTileComponent>;

  const mockTileData = {
    icon: '',
    link: '',
    subtitle: '',
    title: '',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MatIconModule, RouterTestingModule],
      declarations: [TiledMenuTileComponent],
    })
      .overrideComponent(TiledMenuTileComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiledMenuTileComponent);
    component = fixture.componentInstance;
    component.tileData = mockTileData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the tile with a link', () => {
    component.tileData = { route: '/home' };
    fixture.detectChanges();
    const linkElement = fixture.debugElement.query(By.css('a[href="/home"]'));
    expect(linkElement).toBeTruthy();
  });

  it('should render the tile with mat icon', () => {
    component.tileData = { icon: 'home' };
    fixture.detectChanges();
    const iconElement = fixture.debugElement.query(By.css('mat-icon'));
    expect(iconElement).toBeTruthy();
    expect(iconElement.nativeElement.innerHTML).toBe('home');
  });

  it('should render the tile with title', () => {
    component.tileData = { title$: of('Home') };
    fixture.detectChanges();
    const titleElement = fixture.debugElement.query(By.css('.tiled-menu-tile-title'));
    expect(titleElement).toBeTruthy();
    expect(titleElement.nativeElement.innerHTML).toBe('Home');
  });

  it('should render the tile with subtitle', () => {
    component.tileData = { subtitle$: of('Home') };
    fixture.detectChanges();
    const subtitleElement = fixture.debugElement.query(By.css('.tiled-menu-tile-subtitle'));
    expect(subtitleElement).toBeTruthy();
    expect(subtitleElement.nativeElement.innerHTML).toBe('Home');
  });

  it('should toggle is mouse over', () => {
    expect(component.isMouseOver).toBe(false);
    fixture.nativeElement.dispatchEvent(new Event('mouseenter'));
    expect(component.isMouseOver).toBe(true);
    fixture.nativeElement.dispatchEvent(new Event('mouseleave'));
    expect(component.isMouseOver).toBe(false);
  });
});

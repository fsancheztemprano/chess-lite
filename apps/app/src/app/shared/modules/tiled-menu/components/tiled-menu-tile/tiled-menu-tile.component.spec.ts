import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

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
    }).compileComponents();
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
});

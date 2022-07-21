import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IsMobileModule, NgLetModule } from '@app/ui/shared/core';
import { TiledMenuComponent } from './tiled-menu.component';
import { StubTiledMenuTileComponent } from './tiled-menu.component.stub';

describe('TiledMenuComponent', () => {
  let component: TiledMenuComponent;
  let fixture: ComponentFixture<TiledMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsMobileModule, NgLetModule],
      declarations: [TiledMenuComponent, StubTiledMenuTileComponent],
    })
      .overrideComponent(TiledMenuComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiledMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load a tile with a link', () => {
    component.tiles = [{ icon: 'home' }, { icon: 'login' }];
    fixture.detectChanges();

    const tileElement = fixture.debugElement.queryAll(By.css('app-tiled-menu-tile'));
    expect(tileElement.length).toBe(2);
  });
});

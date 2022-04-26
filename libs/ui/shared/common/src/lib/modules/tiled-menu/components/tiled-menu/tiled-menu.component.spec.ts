import { ComponentFixture, TestBed } from '@angular/core/testing';
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
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiledMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

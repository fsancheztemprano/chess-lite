import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatExpansionPanelHarness } from '@angular/material/expansion/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgLetModule } from '@app/ui/shared/core';
import { of } from 'rxjs';
import { SidenavItemComponent } from './sidenav-item.component';

describe('SidenavItemComponent', () => {
  let component: SidenavItemComponent;
  let fixture: ComponentFixture<SidenavItemComponent>;

  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NgLetModule,
        RouterTestingModule,
        MatExpansionModule,
        MatListModule,
        MatIconModule,
        NoopAnimationsModule,
      ],
      declarations: [SidenavItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavItemComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    jest.spyOn(component.router, 'navigate').mockImplementation();
  });

  beforeEach(() => {
    component.items = [
      {
        title$: of('Item 1'),
        icon: 'computer',
        callback: jest.fn(),
      },
      {
        title$: of('Item 2'),
        icon: 'mouse',
        callback: jest.fn(),
        parameters: { id: '2' },
      },
      {
        title$: of('Item 3'),
        route: ['/item/3'],
        icon: 'save',
        callback: jest.fn(),
      },
      {
        title$: of('Item 4'),
        icon: 'tv',
        callback: jest.fn(),
        disabled$: of(true),
      },
      {
        title$: of('Item 5'),
        icon: 'router',
        visible$: of(false),
      },
    ];
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('wrapped by an expansion panel', () => {
    beforeEach(() => {
      component.expandable = true;
      component.expandableTitle = 'Main Section';
      component.expandableIcon = 'science';
      component.expandableLink = ['/main'];

      fixture.detectChanges();
    });

    it('should render an expandable item', () => {
      expect(fixture.nativeElement.querySelector('mat-accordion')).toBeTruthy();

      const matIcon = fixture.nativeElement.querySelector('mat-icon[aria-label="Main Section"]');
      expect(matIcon).toBeTruthy();
      expect(matIcon.textContent).toContain(component.expandableIcon);
    });

    it('should navigate to expandable link on expansion and show content', async () => {
      const matExpansionPanelHarness = await loader.getHarness(MatExpansionPanelHarness);
      await matExpansionPanelHarness.expand();

      expect(component.router.navigate).toHaveBeenCalledWith(component.expandableLink);
      expect(fixture.debugElement.queryAll(By.css('a[mat-list-item].sidenav-title')).length).toBe(1);
      expect(fixture.debugElement.queryAll(By.css('a[mat-list-item].sidenav-option')).length).toBe(4);
    });
  });

  describe('sidenav item options', () => {
    beforeEach(() => {
      component.expandable = false;
      fixture.detectChanges();
    });

    it('should not render an expandable item', () => {
      expect(fixture.nativeElement.querySelector('mat-accordion')).toBeFalsy();
    });

    it('should render items', () => {
      expect(fixture.debugElement.queryAll(By.css('a[mat-list-item].sidenav-option')).length).toBe(4);
    });

    it('should run callback when no route provided', () => {
      const item = fixture.debugElement.query(By.css('a[mat-list-item].sidenav-option-0'));
      expect(item).toBeTruthy();
      expect(item.nativeElement.textContent).toContain('Item 1');
      expect(item.query(By.css('mat-icon'))?.nativeElement.textContent).toBe(component.items[0].icon);

      item.nativeElement.click();

      expect(component.items[0].callback).toHaveBeenCalledTimes(1);
      expect(component.items[0].callback).toHaveBeenCalledWith();
    });

    it('should run callback with parameters when provided', () => {
      const item = fixture.debugElement.query(By.css('a[mat-list-item].sidenav-option-1'));

      item.nativeElement.click();

      expect(component.items[1].callback).toHaveBeenCalledTimes(1);
      expect(component.items[1].callback).toHaveBeenCalledWith({ id: '2' });
    });

    it('should navigate to provided route and not execute callback', () => {
      const item = fixture.debugElement.query(By.css('a[mat-list-item].sidenav-option-2[href="/item/3"]'));

      expect(item).toBeTruthy();

      item.nativeElement.click();

      expect(component.items[2].callback).not.toHaveBeenCalled();
    });

    it('should render disabled item', () => {
      const item = fixture.debugElement.query(By.css('a[mat-list-item].sidenav-option-3'));

      expect(item).toBeTruthy();

      item.nativeElement.click();
      expect(component.items[3].callback).not.toHaveBeenCalled();
    });

    it('should not render hidden items', () => {
      expect(fixture.debugElement.queryAll(By.css('a[mat-list-item].sidenav-option-4')).length).toBe(0);
    });
  });
});

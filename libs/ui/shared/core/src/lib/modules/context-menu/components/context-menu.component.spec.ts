import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTooltipHarness } from '@angular/material/tooltip/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ContextMenuComponent } from './context-menu.component';

describe('ContextMenuComponent', () => {
  let component: ContextMenuComponent;
  let fixture: ComponentFixture<ContextMenuComponent>;
  let loader: HarnessLoader;
  let matMenuHarness: MatMenuHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'home', component: ContextMenuComponent },
          { path: 'search', component: ContextMenuComponent },
        ]),
        MatMenuModule,
        MatTooltipModule,
        MatIconModule,
        NoopAnimationsModule,
      ],
      declarations: [ContextMenuComponent],
    })
      .overrideComponent(ContextMenuComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(ContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    matMenuHarness = await loader.getHarness(MatMenuHarness);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should prevent navigation', () => {
    const event = {
      stopPropagation: jest.fn(),
      preventDefault: jest.fn(),
    };

    expect(event.stopPropagation).not.toHaveBeenCalled();
    expect(event.preventDefault).not.toHaveBeenCalled();

    component.preventNavigation(event as any);

    expect(event.stopPropagation).toHaveBeenCalledTimes(1);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
  });

  describe('menu', () => {
    it('should create a menu', async () => {
      return expect(loader.getHarness(MatMenuHarness)).resolves.toBeTruthy();
    });

    it('should create a menu with title and icon', async () => {
      const tooltip = await loader.getHarness(MatTooltipHarness);

      component.title = 'title';
      component.icon = 'home';
      fixture.detectChanges();

      expect(await matMenuHarness.getTriggerText()).toBe(component.icon);
      await tooltip.show();
      expect(await tooltip.getTooltipText()).toBe(component.title);
    });

    it('should create a menu with disabled option', async () => {
      component.disabled = true;
      fixture.detectChanges();

      expect(await matMenuHarness.isDisabled()).toBe(true);
    });

    it('should create a menu disabled if no option provided', async () => {
      component.disabled = false;
      component.menuOptions = [];
      fixture.detectChanges();

      expect(await matMenuHarness.isDisabled()).toBe(true);
    });
  });

  describe('menu options', () => {
    beforeEach(async () => {
      component.menuOptions = [
        {
          title$: of('Option 1'),
          callback: jest.fn(),
        },
        {
          title$: of('Option 2'),
          callback: jest.fn(),
          parameters: {
            testParam: 'testValue',
          },
        },
        {
          title$: of('Option 3'),
          icon: 'home',
          route: ['/search'],
          callback: jest.fn(),
        },
        {
          title$: of('Option 4'),
          disabled$: of(true),
        },
      ];
      fixture.detectChanges();
      await matMenuHarness.open();
    });

    it('should create a menu with option', async () => {
      const options = await matMenuHarness.getItems();

      expect(options.length).toBe(4);
    });

    it('should create a menu with option with title', async () => {
      const options = await matMenuHarness.getItems();

      expect(await options[0].getText()).toBe('Option 1');

      await options[0].click();
      expect(component.menuOptions[0].callback).toHaveBeenCalledTimes(1);
    });

    it('should create a menu with option with title and parameters', async () => {
      const options = await matMenuHarness.getItems();

      expect(await options[1].getText()).toBe('Option 2');

      await options[1].click();
      expect(component.menuOptions[1].callback).toHaveBeenCalledTimes(1);
      expect(component.menuOptions[1].callback).toHaveBeenCalledWith({ testParam: 'testValue' });
    });

    it('should create a menu with option with title and route', fakeAsync(async () => {
      const options = await matMenuHarness.getItems();
      const router: Router = TestBed.inject(Router);

      expect(await options[2].getText()).toBe('homeOption 3');

      expect(router.url).not.toBe('/search');

      await options[2].click();

      expect(router.url).toBe('/search');
      expect(component.menuOptions[2].callback).not.toHaveBeenCalled();
    }));

    it('should create a menu with option with title and disabled', async () => {
      const options = await matMenuHarness.getItems();

      expect(await options[3].getText()).toBe('Option 4');
      expect(await options[3].isDisabled()).toBe(true);
    });
  });
});

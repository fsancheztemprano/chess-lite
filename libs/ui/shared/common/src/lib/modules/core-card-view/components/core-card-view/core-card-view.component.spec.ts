import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCardHarness } from '@angular/material/card/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  IsMobileModule,
  IsMobileService,
  NgLetModule,
  StubCoreContextMenuComponent,
  StubIsMobileService,
  stubIsMobileServiceProvider,
  StubRouteUpButtonComponent,
} from '@app/ui/shared/core';
import { getTranslocoModule } from '@app/ui/testing';
import { CoreCardViewComponent } from './core-card-view.component';

describe('CoreCardViewComponent', () => {
  let component: CoreCardViewComponent;
  let fixture: ComponentFixture<CoreCardViewComponent>;
  let loader: HarnessLoader;
  let isMobileService: StubIsMobileService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        IsMobileModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatTabsModule,
        NgLetModule,
        getTranslocoModule(),
      ],
      declarations: [CoreCardViewComponent, StubRouteUpButtonComponent, StubCoreContextMenuComponent],
      providers: [stubIsMobileServiceProvider],
    })
      .overrideComponent(CoreCardViewComponent, { set: { changeDetection: ChangeDetectionStrategy.Default } })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreCardViewComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    isMobileService = TestBed.inject(IsMobileService) as unknown as StubIsMobileService;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show mat card', async () => {
    return expect(loader.getHarness(MatCardHarness)).resolves.toBeTruthy();
  });

  it('should not show header on mobile view', async () => {
    isMobileService['isHandset'].next(true);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.mat-card-header'))).toBeFalsy();
  });

  it('should show header on desktop view', async () => {
    isMobileService['isHandset'].next(false);

    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('.mat-card-header'))).toBeTruthy();
  });

  it('should show app-route-up-button', () => {
    expect(fixture.debugElement.query(By.css('app-route-up-button'))).toBeTruthy();
  });

  it('should show mat card title', async () => {
    component.title = 'title';
    fixture.detectChanges();
    const card = await loader.getHarness(MatCardHarness);
    return expect(card.getText()).resolves.toEqual(component.title);
  });

  it('should show app-core-context-menu', () => {
    expect(fixture.debugElement.query(By.css('app-core-context-menu'))).toBeTruthy();
  });

  it('should show mat-card-content', () => {
    expect(fixture.debugElement.query(By.css('mat-card-content'))).toBeTruthy();
  });
});

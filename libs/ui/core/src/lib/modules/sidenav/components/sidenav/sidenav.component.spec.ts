import { LayoutModule } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  IsMobileModule,
  NgLetModule,
  stubSessionServiceProvider,
  stubSidenavServiceProvider,
  stubUserServiceProvider,
} from '@app/ui/shared';
import { HalFormClientModule } from '@hal-form-client';
import { SidenavComponent } from './sidenav.component';

@Component({ selector: 'app-user-settings-sidenav-item', template: '' })
class StubUserSettingsSidenavItemComponent {}

@Component({ selector: 'app-administration-sidenav-item', template: '' })
class StubAdministrationSidenavItemComponent {}

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SidenavComponent, StubUserSettingsSidenavItemComponent, StubAdministrationSidenavItemComponent],
      imports: [
        NoopAnimationsModule,
        LayoutModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        IsMobileModule,
        NgLetModule,
        RouterTestingModule,
        HalFormClientModule,
      ],
      providers: [stubSidenavServiceProvider, stubUserServiceProvider, stubSessionServiceProvider],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});

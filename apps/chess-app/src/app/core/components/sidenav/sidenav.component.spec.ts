import { LayoutModule } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { stubAuthServiceProvider } from '../../../auth/services/auth.service.stub';
import { stubLoginServiceProvider } from '../../../auth/services/login.service.stub';
import { NgLetModule } from '../../../shared/directives/ng-let.directive';
import { IsMobileModule } from '../../../shared/pipes/is-mobile.pipe';
import { stubSidenavServiceProvider } from '../../services/sidenav.service.stub';
import { AdministrationSidenavItemComponent } from './administration-sidenav-item/administration-sidenav-item.component';
import { SidenavComponent } from './sidenav.component';
import { UserSettingsSidenavItemComponent } from './user-settings-sidenav-item/user-settings-sidenav-item.component';

@Component({ selector: 'chess-lite-user-settings-sidenav-item', template: '' })
class StubUserSettingsSidenavItemComponent implements Partial<UserSettingsSidenavItemComponent> {}

@Component({ selector: 'chess-lite-administration-sidenav-item', template: '' })
class StubAdministrationSidenavItemComponent implements Partial<AdministrationSidenavItemComponent> {}

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(
    waitForAsync(() => {
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
        ],
        providers: [stubAuthServiceProvider, stubSidenavServiceProvider, stubLoginServiceProvider],
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});

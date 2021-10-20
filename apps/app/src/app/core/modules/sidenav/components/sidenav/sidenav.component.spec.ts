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
import { HalFormClientTestingModule } from '@hal-form-client/testing';
import { IsMobileModule } from '../../../../../shared/modules/is-mobile/is-mobile.module';
import { NgLetModule } from '../../../../../shared/modules/ng-let/ng-let.module';
import { stubSessionServiceProvider } from '../../../../services/session.service.stub';
import { stubUserServiceProvider } from '../../../../services/user.service.stub';
import { stubSidenavServiceProvider } from '../../services/sidenav.service.stub';
import { AdministrationSidenavItemComponent } from '../administration-sidenav-item/administration-sidenav-item.component';
import { UserSettingsSidenavItemComponent } from '../user-settings-sidenav-item/user-settings-sidenav-item.component';
import { SidenavComponent } from './sidenav.component';

@Component({ selector: 'app-user-settings-sidenav-item', template: '' })
class StubUserSettingsSidenavItemComponent implements Partial<UserSettingsSidenavItemComponent> {}

@Component({ selector: 'app-administration-sidenav-item', template: '' })
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
          RouterTestingModule,
          HalFormClientTestingModule,
        ],
        providers: [stubSidenavServiceProvider, stubUserServiceProvider, stubSessionServiceProvider],
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

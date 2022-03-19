import { LayoutModule } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { IsMobileModule, NgLetModule, stubSidenavServiceProvider, stubUserServiceProvider } from '@app/ui/shared';
import { SidenavComponent } from './sidenav.component';

@Component({ selector: 'app-home-sidenav-item', template: '' })
class StubHomeSidenavItemComponent {}

@Component({ selector: 'app-user-settings-sidenav-item', template: '' })
class StubUserSettingsSidenavItemComponent {}

@Component({ selector: 'app-administration-sidenav-item', template: '' })
class StubAdministrationSidenavItemComponent {}

@Component({ selector: 'app-authentication-sidenav-item', template: '' })
class StubAuthenticationSidenavItemComponent {}

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        SidenavComponent,
        StubHomeSidenavItemComponent,
        StubUserSettingsSidenavItemComponent,
        StubAdministrationSidenavItemComponent,
        StubAuthenticationSidenavItemComponent,
      ],
      imports: [LayoutModule, MatSidenavModule, MatToolbarModule, IsMobileModule, NgLetModule],
      providers: [stubSidenavServiceProvider, stubUserServiceProvider],
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
